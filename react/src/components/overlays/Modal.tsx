import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { FocusTrap } from "focus-trap-react";

import { cn } from "@/lib/utils/cn.js";

// todo: https://react.dev/reference/react-dom/createPortal
// lets modal "escape" parent and render in `body`
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  escTxt?: string;
  hideCancelBtn?: boolean;
  selfManagesFocus?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
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
}: ModalProps) {
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

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

  // track visualViewport so the overlay recalculates when the iPad/iOS
  // on-screen keyboard opens (layout viewport/100vh doesn't shrink there)
  useEffect(() => {
    if (!isOpen) return;

    const vv = window.visualViewport;
    if (!vv) return;

    const updateViewport = () => {
      const el = overlayRef.current;
      if (!el) return;
      el.style.height = `${vv.height}px`;
      el.style.top = `${vv.offsetTop}px`;
    };

    updateViewport();
    vv.addEventListener("resize", updateViewport);
    vv.addEventListener("scroll", updateViewport);
    return () => {
      vv.removeEventListener("resize", updateViewport);
      vv.removeEventListener("scroll", updateViewport);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        overlayClassName,
      )}
      onClick={onClose}
    >
      <FocusTrap
        focusTrapOptions={{
          initialFocus: selfManagesFocus ? false : "#modal-focus-element",
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
              className="btn btn-secondary outline-none"
              onClick={onClose}
            >
              {escTxt}
            </button>
          )}
        </div>
      </FocusTrap>
    </div>,
    document.body,
  );
}
