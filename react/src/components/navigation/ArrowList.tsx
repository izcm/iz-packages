import type { ReactNode } from "react";
import React, { useRef } from "react";

import { cn } from "@/lib/utils/cn.js";

type ArrowListProps<T> = {
  items: readonly T[];
  getId: (item: T) => string;
  selectedId: string | undefined;
  onSelect: (item: T) => void;
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
  children,
  className = "",
  ref,
  direction = "vertical",
  bare,
}: ArrowListProps<T>) {
  const base = bare ? "" : "overflow-y-auto no-scrollbar p-1";
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

        onSelect(items[0]);
      }}
      onKeyDown={(e) => {
        if (!items.length) return;

        if (e.key === "Home") {
          e.preventDefault();
          onSelect(items[0]);
          return;
        }

        if (e.key === "End") {
          e.preventDefault();
          onSelect(items[items.length - 1]);
          return;
        }

        if (e.key !== prevKey && e.key !== nextKey) return;
        e.preventDefault();

        const index =
          selectedId === undefined
            ? 0
            : items.findIndex((it) => getId(it) === selectedId);

        if (index === -1) return;

        let next = index;

        if (e.key === nextKey) next = Math.min(index + 1, items.length - 1);
        if (e.key === prevKey) next = Math.max(index - 1, 0);

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
