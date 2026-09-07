import { cn } from "@/lib/utils/cn.js";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <div className="inline-flex items-center">
      <label className="relative flex cursor-pointer items-center">
        <input
          {...props}
          type="checkbox"
          className={cn(
            "peer size-5 cursor-pointer appearance-none rounded",
            "border border-slate-600 shadow transition-all hover:shadow-md",
            "checked:border-slate-800 checked:bg-slate-800",
            className,
          )}
        />

        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </label>
    </div>
  );
}
