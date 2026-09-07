import { Page } from "@a2zb/types";
import { Result } from "./result.js";

function mapResult<TDTO, T>(
  res: Result<{ items: TDTO[]; nextCursor: string | null }>,
  toDomain: (dto: TDTO) => T,
): Result<Page<T>> {
  if (!res.ok) return res;

  return {
    ok: true,
    data: {
      items: res.data.items.map(toDomain),
      nextCursor: res.data.nextCursor,
    },
  };
}
