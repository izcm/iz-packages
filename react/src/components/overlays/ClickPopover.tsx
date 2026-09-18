import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils/cn.js";

type ClickPopoverProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  /** Overrides the dropdown's default anchored positioning (e.g. to center it as a wide sheet). */
  contentClassName?: string;
  /** Controlled open state — omit to let Popover manage it internally. */
};

/**
 * Popover that toggles when its trigger is clicked.
 *
 * Handles its own open state by default, click-outside closing,
 * and Escape. Pass `open` and `onOpenChange` to control it externally.
 */
export function ClickPopover({
  trigger,
  children,
  align = "right",
  contentClassName,
  open: openProp,
  onOpenChange,
}: ClickPopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;

  const setOpen = useCallback(
    (value: boolean | ((v: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value;
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [open, openProp, onOpenChange],
  );

  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // default to opening below; flip above only if it would overflow the
  // viewport and there's actually more room up there. Runs before paint
  // (useLayoutEffect) so there's no visible flash of the wrong placement.
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

  useLayoutEffect(() => {
    if (!open) return;
    const el = contentRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const overflowsBottom = rect.bottom > window.innerHeight;
    const moreRoomAbove = rect.top > window.innerHeight - rect.bottom;

    setPlacement(overflowsBottom && moreRoomAbove ? "top" : "bottom");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer flex items-center"
      >
        {trigger}
      </div>

      {open && (
        <div
          ref={contentRef}
          className={cn(
            "absolute z-50 whitespace-nowrap bg-raised border border-line",
            placement === "top" ? "bottom-full mb-1" : "top-full mt-1",
            align === "right" ? "right-0" : "left-0",
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
