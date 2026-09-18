import { cn } from "@/lib/utils/cn.js";

type Props = {
  label?: string;
  color?: string;
  className?: string;
};

export const LiveBadge = ({ label = "LIVE", color, className }: Props) => (
  <span
    className={cn(
      "inline-flex items-baseline gap-1.5 text-xs font-medium",
      !color && "text-warning",
      className,
    )}
    style={color ? { color } : undefined}
  >
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
    </span>
    {label}
  </span>
);
