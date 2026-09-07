import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn.js";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon?: ReactNode;
  external?: boolean;
};

export function IconLink({
  children,
  className,
  icon,
  external = false,
  ...props
}: Props) {
  return (
    <a
      {...props}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "flex btn justify-between text-sm text-fg no-underline",
        className,
      )}
    >
      {children}

      {icon && <span aria-hidden="true">{icon}</span>}
    </a>
  );
}
