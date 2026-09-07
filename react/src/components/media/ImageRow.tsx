import { ReactNode } from "react";

import { cn } from "@/lib/utils/cn.js";

type Props = {
  image: string;
  title: ReactNode;
  subtitle?: ReactNode;
  endContent?: ReactNode;
  imageBadge?: ReactNode;
  imageSize?: number;
  className?: string;
};

export function ImageRow({
  image,
  title,
  subtitle,
  endContent,
  imageBadge,
  imageSize = 50,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr_auto] items-center gap-4 py-1 px-2",
        className,
      )}
    >
      <div data-slot="image-wrap" className="relative shrink-0">
        <img
          data-slot="image"
          src={image}
          alt={typeof title === "string" ? title : ""}
          width={imageSize}
          height={imageSize}
          className="rounded object-cover"
        />
        {imageBadge}
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <span data-slot="title" className="text-sm font-semibold truncate">
          {title}
        </span>
        <span data-slot="subtitle" className="text-xs text-muted inline-block">
          {subtitle}
        </span>
      </div>

      {endContent}
    </div>
  );
}
