import { ComponentType, SVGProps } from "react";

import { cn } from "@/lib/utils/cn.js";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function IconBtn({
  children,
  icon: Icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn("flex btn text-sm text-fg no-underline", className)}
    >
      <div className="flex items-center gap-3">{children}</div>

      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
    </button>
  );
}
