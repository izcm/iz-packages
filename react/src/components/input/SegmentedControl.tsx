import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn.js";

export type SegmentedControlOption<T extends string> = {
  label: ReactNode;
  value: T;
};

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: readonly SegmentedControlOption<T>[];

  buttonClassName?: string;

  htmlButtonElementProps?: Omit<
    ComponentProps<"button">,
    "onClick" | "children"
  >;
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  buttonClassName,
  htmlButtonElementProps,
}: Props<T>) {
  return (
    <>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            {...htmlButtonElementProps}
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(active && "bg-accent", buttonClassName)}
          >
            {option.label}
          </button>
        );
      })}
    </>
  );
}
