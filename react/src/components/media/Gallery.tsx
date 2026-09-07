import { ReactNode, RefObject, useEffect } from "react";

import { ArrowRow } from "../data-display/index.js";
import { ArrowList } from "../navigation/index.js";
import { cn } from "@/lib/utils/cn.js";

export type GalleryProps<T> = {
  // items and selection
  items: readonly T[];
  getId: (item: T) => string;
  selected?: T;
  onSelect?: (item: T) => void;
  onEnter?: (item: T) => void;

  // render
  galleryItem: (item: T) => ReactNode;
  isFresh?: (item: T) => boolean;
  isDisabled?: (item: T) => boolean;
  itemClassName?: (state: {
    isSelected: boolean;
    isFresh?: boolean;
    isDisabled?: boolean;
  }) => string;

  // ref + pagination
  ref?: RefObject<HTMLUListElement | null>;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  className?: { arrowList?: string; arrowRow?: string };
};

export function Gallery<T>({
  items,
  getId,
  galleryItem,
  selected,
  onSelect,
  onEnter,
  isFresh,
  isDisabled,
  itemClassName,
  ref,
  onLoadMore,
  isLoading,
  hasMore,
  className,
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

  return (
    <ArrowList
      ref={ref}
      items={items}
      getId={getId}
      selectedId={selected ? getId(selected) : undefined}
      onSelect={(c) => onSelect?.(c)}
      className={cn(
        // "min-h-0 flex-1 p-1",
        className?.arrowList,
      )}
    >
      {({ item, isSelected, onSelect }) => (
        <ArrowRow
          key={getId(item)}
          isSelected={isSelected}
          onSelect={onSelect}
          onEnter={onEnter ? () => onEnter(item) : undefined}
          dataId={getId(item)}
          className={cn(
            itemClassName?.({
              isSelected,
              isFresh: isFresh?.(item),
              isDisabled: isDisabled?.(item),
            }),
            className?.arrowRow,
          )}
        >
          {galleryItem(item)}
        </ArrowRow>
      )}
    </ArrowList>
  );
}
