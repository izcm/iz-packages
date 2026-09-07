import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { FocusTrap } from "focus-trap-react";
import { cn } from "@/lib/utils/cn.js";

// export const defaultModalClasses = [
//   "flex flex-col gap-2",
//   "bg-raised",
//   "border border-line",
//   "rounded-lg",
//   "shadow-lg p-2",
// ].join(" ");

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  escTxt?: string;
  hideCancelBtn?: boolean;
  selfManagesFocus?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  bare?: boolean;
  overlayClassName?: string;
  children: ReactNode;
};

export function Modal({
  isOpen,
  onClose,
  children,
  escTxt = "Close",
  hideCancelBtn = false,
  selfManagesFocus,

  ariaLabel,
  ariaLabelledBy,

  className,
  overlayClassName,

  // bare = false,
}: ModalProps) {
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // close on Escape
  const handler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      lastFocusedRef.current?.focus();
    };
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[999] flex items-center justify-center",
        overlayClassName,
      )}
      onClick={onClose}
    >
      <FocusTrap
        focusTrapOptions={{
          initialFocus:
            selfManagesFocus || hideCancelBtn ? false : "#modal-close-btn",
        }}
      >
        <div
          className={cn(className)}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        >
          {children}

          {!hideCancelBtn && (
            <button
              id="modal-close-btn"
              className="btn btn-secondary outline-none"
              onClick={onClose}
            >
              {escTxt}
            </button>
          )}
        </div>
      </FocusTrap>
    </div>
  );
}
