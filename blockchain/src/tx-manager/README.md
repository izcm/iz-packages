# tx-manager

tx-manager exists to handle async transaction sending and retries in one place, instead of each caller doing it separately.

- Callers (bash scripts, cron jobs, whatever) don't send transactions themselves. They build a JSON array of **envelopes** (`eth-transfer` or `contract-call`) describing what should be sent, and write it to a file.
- tx-manager reads that file and, for every unsent envelope, sends it and writes the result back into the same JSON.
- Retry decisions use viem's own `isRetryable`, with some modification, to decide whether a failed transaction should be retried or marked as permanently failed.

| File                | Description                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `main.ts`           | Entrypoint. Reads the envelope file, dispatches each unsent envelope, polls for a receipt                   |
| `schemas.ts`        | Envelope types — `eth-transfer` and `contract-call`                                                         |
| `account-at-idx.ts` | Derives the signer for an envelope from `PARTICIPANT_MNEMONIC` + participant index                          |
| `encode-call.ts`    | Encodes calldata for `contract-call` envelopes                                                              |
| `is-retryable.ts`   | Classifies send/receipt errors (nonce issues, rate limits, etc.) to decide retry vs. permanent failure      |

**Status lifecycle** — written back into the same envelope JSON: unsent (no status) → `pending` → `success` | `failure`.

## Env vars

| Var                   | Description                                                            |
| ---------------------- | ----------------------------------------------------------------------|
| `RPC_URL`             | RPC endpoint to send from / poll receipts against                     |
| `CHAIN_ID`            | Chain id, used to build the viem chain object                         |
| `PARTICIPANT_MNEMONIC`| Mnemonic that signers are derived from (`accountAtIndex`)             |

## Invoking it

```sh
npx tsx tx-manager/main.ts <tx-json-file> <timespan-seconds>
```

`<tx-json-file>` is the envelope array (read + rewritten in place). `<timespan-seconds>` is how long to keep polling before giving up.

Example `make` target wiring a bash envelope builder to tx-manager:

```make
distribute-eth:
	@TX_FILE=$(TX_OUT_DIR)/distribute-eth.json && \
	./ops/funding/distribute-eth.sh $(FUNDER_IDX) $(P_SIZE) $$TX_FILE \
		--start-idx $(P_IDX_START) && \
	npx tsx ./tx-manager/main.ts $$TX_FILE $(TX_MANAGER_TIMESPAN)
```

## Envelope builder example

Callers don't send transactions — they just emit the envelope JSON. Example bash script building `eth-transfer` envelopes with `jq`:

```sh
#!/bin/bash
# distribute-eth.sh <funder_idx> <to_count> <tx-json-out-file> [--start-idx <idx>] [--amount <wei>]

FUNDER_IDX=$1
TO_COUNT=$2
OUT_FILE=$3
shift 3

START_IDX=0
WEI_PER_RECIPIENT=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --start-idx) START_IDX="$2"; shift 2 ;;
        --amount) WEI_PER_RECIPIENT="$2"; shift 2 ;;
        *) echo "Unknown flag: $1"; exit 1 ;;
    esac
done

jq -cn \
    --argjson start "$START_IDX" \
    --argjson count "$TO_COUNT" \
    --argjson fromIdx "$FUNDER_IDX" \
    --arg value "$WEI_PER_RECIPIENT" '
[
  range($start; $start + $count) as $i
  | select($i != $fromIdx)
  | {
      type: "eth-transfer",
      from: { kind: "participant", idx: $fromIdx },
      to: { kind: "participant", idx: $i },
      value: $value
    }
]
' > "$OUT_FILE"
```

Which produces envelopes like this, one per recipient:

```json
[
  {
    "type": "eth-transfer",
    "from": { "kind": "participant", "idx": 0 },
    "to": { "kind": "participant", "idx": 1 },
    "value": "1000000000000000000"
  }
]
```

A `contract-call` envelope looks like this instead (`args` may mix literals and `{ kind: "participant", idx }` references, which get resolved to that participant's address):

```json
[
  {
    "type": "contract-call",
    "from": { "kind": "participant", "idx": 0 },
    "to": "0x5FbDB2315678afecb367f032d93F642f64180aa",
    "sig": "transfer(address,uint256)",
    "args": [{ "kind": "participant", "idx": 1 }, "1000000000000000000"]
  }
]
```

After tx-manager runs, each envelope gets `status`, `txHash`, `nonce`, and (on failure) `errMsg` written back into the same file.
