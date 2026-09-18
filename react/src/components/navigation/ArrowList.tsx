import type { ReactNode } from "react";
import React, { useRef } from "react";

import { cn } from "@/lib/utils/cn.js";

type ArrowListProps<T> = {
  items: readonly T[];
  getId: (item: T) => string;
  selectedId: string | undefined;
  onSelect: (item: T) => void;
  isDisabled?: (item: T) => boolean;
  children: (args: {
    item: T;
    isSelected: boolean;
    onSelect: () => void;
  }) => ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLUListElement | null>;
  direction?: "vertical" | "horizontal";
  bare?: boolean;
};

export function ArrowList<T>({
  items,
  getId,
  selectedId,
  onSelect,
  isDisabled,
  children,
  className = "",
  ref,
  direction = "vertical",
  bare,
}: ArrowListProps<T>) {
  const base = bare ? "" : "overflow-y-auto no-scrollbar";
  const [prevKey, nextKey] =
    direction === "horizontal"
      ? ["ArrowLeft", "ArrowRight"]
      : ["ArrowUp", "ArrowDown"];
  const previousFocusRef = useRef<HTMLElement | null>(null);

  return (
    <ul
      ref={ref}
      className={cn(base, className)}
      tabIndex={0}
      onFocus={(e) => {
        if (e.target !== e.currentTarget) return;
        if (items.length === 0) return;

        const cameFromInside =
          e.relatedTarget && e.currentTarget.contains(e.relatedTarget);

        if (cameFromInside) {
          previousFocusRef.current?.focus();
          return;
        }

        previousFocusRef.current = e.relatedTarget as HTMLElement | null;

        // if focus moves from outside the element -> focus on:
        // A) last focused item in list
        // B) first item in list if A is undefined
        if (selectedId) {
          e.currentTarget.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
          return;
        }

        // all items disabled -> nothing valid to select, leave selection untouched
        const firstEnabled = items.findIndex((it) => !isDisabled?.(it));
        if (firstEnabled !== -1) onSelect(items[firstEnabled]);
      }}
      onKeyDown={(e) => {
        if (!items.length) return;

        if (e.key === "Home") {
          e.preventDefault();
          const firstEnabled = items.findIndex((it) => !isDisabled?.(it));
          if (firstEnabled !== -1) onSelect(items[firstEnabled]);
          return;
        }

        if (e.key === "End") {
          e.preventDefault();
          let lastEnabled = -1;
          for (let i = items.length - 1; i >= 0; i--) {
            if (!isDisabled?.(items[i])) {
              lastEnabled = i;
              break;
            }
          }
          if (lastEnabled !== -1) onSelect(items[lastEnabled]);
          return;
        }

        if (e.key !== prevKey && e.key !== nextKey) return;
        e.preventDefault();

        const index =
          selectedId === undefined
            ? 0
            : items.findIndex((it) => getId(it) === selectedId);

        if (index === -1) return;

        const step = e.key === nextKey ? 1 : -1;
        const total = items.length;

        // walk in `step` direction, wrapping around the ends, for the next
        // non-disabled item; if none exists besides the current one, stay put
        let next = index;
        for (let offset = 1; offset < total; offset++) {
          const i = (((index + step * offset) % total) + total) % total;
          if (!isDisabled?.(items[i])) {
            next = i;
            break;
          }
        }

        onSelect(items[next]);
      }}
    >
      {items.map((item) => {
        const isSelected =
          selectedId !== undefined && getId(item) === selectedId;

        return children({ item, isSelected, onSelect: () => onSelect(item) });
      })}
    </ul>
  );
}
