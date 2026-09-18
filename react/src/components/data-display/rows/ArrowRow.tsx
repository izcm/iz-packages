import type { ComponentProps, ReactNode } from "react";
import { useEffect, useRef } from "react";

type ArrowRowProps = {
  isSelected: boolean;
  isDisabled?: boolean;
  onSelect: () => void;
  onEnter?: () => void;
  children: ReactNode;
  className?: string;
  focusOnMount?: boolean;
  htmlLiElementProps?: ComponentProps<"li"> & {
    [key: `data-${string}`]: string;
  };
};

export function ArrowRow({
  isSelected,
  isDisabled,
  onSelect,
  onEnter,
  children,
  className,
  htmlLiElementProps,
  focusOnMount = true,
}: ArrowRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const li = ref.current;
    if (!li) return;

    li.querySelectorAll<HTMLElement>(
      "a, button, input, select, textarea, [tabindex]",
    ).forEach((el) => {
      el.tabIndex = isSelected ? 0 : -1;
    });

    if (isSelected && (focusOnMount || !isInitialMount.current)) {
      li.focus();
    }
    isInitialMount.current = false;
  }, [isSelected, focusOnMount]);

  return (
    <li
      {...htmlLiElementProps}
      ref={ref}
      aria-disabled={isDisabled}
      tabIndex={!isDisabled && isSelected ? 0 : -1}
      onClick={isDisabled ? undefined : (onEnter ?? onSelect)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onEnter && !isDisabled) {
          e.preventDefault();
          onEnter();
        }
      }}
      className={className}
    >
      {children}
    </li>
  );
}
