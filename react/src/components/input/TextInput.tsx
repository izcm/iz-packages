import React, { useState } from "react";

import { cn } from "@/lib/utils/cn.js";
import { EnterIcon } from "@/lib/icons.js";

type Props = {
  value?: string;
  onSubmit?: (value: string) => void;
  numeric?: boolean;
  className?: string;
  submitLabel?: string;
  startIcon?: React.ReactNode;
  htmlInputProps?: React.ComponentProps<"input">;
};

// internal state is added. then render only happens on submit

export function TextInput({
  value,
  onSubmit,
  numeric,
  className,
  submitLabel,
  startIcon,
  htmlInputProps: input,
}: Props) {
  const [internal, setInternal] = useState(value ?? "");
  const [prevValue, setPrevValue] = useState(value);

  // if parent changed value prop - sync internal to match
  if (prevValue !== value) {
    setPrevValue(value);
    setInternal(value ?? "");
  }

  return (
    <div className={cn("text-input flex items-center w-full", className)}>
      {startIcon && (
        <span className="ml-3 shrink-0 text-muted">{startIcon}</span>
      )}

      <input
        {...input}
        ref={input?.ref}
        className={cn(
          "min-w-0 flex-1 px-4 py-2 outline-none",
          input?.className,
        )}
        value={internal}
        onChange={(e) => {
          const value = numeric
            ? e.currentTarget.value.replace(/[^0-9.]/g, "")
            : e.currentTarget.value;

          setInternal(value);
          e.target.value = value;
          input?.onChange?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit?.(internal);
          } else if (e.key === "Escape") {
            setInternal("");
          }

          input?.onKeyDown?.(e);
        }}
      />

      {internal !== (value ?? "") && submitLabel && (
        <span className="mr-3 inline-flex shrink-0 items-center gap-1 text-xs text-muted">
          <EnterIcon size={14} />
          {submitLabel}
        </span>
      )}
    </div>
  );
}
