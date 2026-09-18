import { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

import { cn } from "./lib/utils/cn";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
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
  const Component = external ? "a" : Link;

  return (
    <Component
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
    </Component>
  );
}
