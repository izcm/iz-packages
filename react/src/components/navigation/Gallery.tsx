import { ComponentProps, ReactNode, RefObject, useEffect } from "react";

import { cn } from "@/lib/utils/cn.js";

import { ArrowRow } from "./ArrowRow.js";
import { ArrowList } from "./ArrowList.js";

const focusInset =
  "focus-visible:!ring-1 focus-visible:!ring-accent focus-visible:!ring-inset;";

// depends on the theme variables in a2zb/styles
// decoupled from gallery, callers that use a2zb/styles may use
export const defaultClasses = ({
  isSelected,
  isDisabled = false,
}: {
  isSelected: boolean;
  isDisabled?: boolean;
}) =>
  cn(
    "border rounded p-4 flex flex-col gap-3 transition bg-raised cursor-pointer",
    isDisabled
      ? "border-line opacity-60 pointer-events-none cursor-default"
      : isSelected
        ? "[&_svg]:text-accent border-accent-muted"
        : "border-line hover:border-accent",
  );

export type GalleryProps<T> = {
  // items and selection
  items: readonly T[];
  getId: (item: T) => string;
  selected?: T;
  onSelect?: (item: T) => void;
  onEnter?: (item: T) => void;

  // render
  galleryItem: (item: T, isSelected: boolean) => ReactNode;
  isDisabled?: (item: T) => boolean;

  // ref + pagination
  ref?: RefObject<HTMLUListElement | null>;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  direction?: "vertical" | "horizontal";

  htmlUlElementProps?: Omit<ComponentProps<"ul">, "ref">;
  htmlLiElementProps?: (state: {
    isSelected: boolean;
    isDisabled?: boolean;
  }) => Omit<ComponentProps<"li">, "ref">;
};

export function Gallery<T>({
  items,
  getId,
  galleryItem,
  selected,
  onSelect,
  onEnter,
  isDisabled,
  ref,
  onLoadMore,
  isLoading,
  hasMore,
  direction,
  htmlUlElementProps,
  htmlLiElementProps,
}: GalleryProps<T>) {
  // load more on 'regular' scroll
  useEffect(() => {
    const el = ref?.current;
    if (!el || !onLoadMore) return;

    const handleScroll = () => {
      const distance = el.scrollHeight - (el.scrollTop + el.clientHeight);

      if (distance < 100 && !isLoading && hasMore) {
        onLoadMore();
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [ref, onLoadMore, isLoading, hasMore]);

  // load more for keyboard
  useEffect(() => {
    if (!selected || !onLoadMore || isLoading || !hasMore) return;

    const index = items.findIndex((i) => getId(i) === getId(selected));
    if (index === -1) return;

    if (items.length - index < 5) {
      onLoadMore();
    }
  }, [selected, getId, items.length, hasMore, isLoading, items, onLoadMore]);

  useEffect(() => {
    if (!selected || !ref?.current) return;

    const el = ref.current.querySelector(
      `[data-id="${getId(selected)}"]`,
    ) as HTMLElement | null;

    if (!el) return;

    el.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: "smooth",
    });

    el.scrollTop -= 40;
  }, [selected, ref]);

  const { className: ulClassName, ...restUlProps } = htmlUlElementProps ?? {};

  return (
    <ArrowList
      ref={ref}
      items={items}
      getId={getId}
      selectedId={selected ? getId(selected) : undefined}
      onSelect={(c) => onSelect?.(c)}
      isDisabled={isDisabled}
      direction={direction}
      htmlUlElementProps={restUlProps}
      className={ulClassName}
    >
      {({ item, isSelected, onSelect }) => {
        const { className: liClassName, ...restLiProps } =
          htmlLiElementProps?.({
            isSelected,
            isDisabled: isDisabled?.(item),
          }) ?? {};

        return (
          <ArrowRow
            key={getId(item)}
            isSelected={isSelected}
            isDisabled={isDisabled?.(item)}
            onSelect={onSelect}
            onEnter={onEnter ? () => onEnter(item) : undefined}
            htmlLiElementProps={{ ...restLiProps, "data-id": getId(item) }}
            className={liClassName}
          >
            {galleryItem(item, isSelected)}
          </ArrowRow>
        );
      }}
    </ArrowList>
  );
}
