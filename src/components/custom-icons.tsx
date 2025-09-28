import { cn } from "@/lib/utils";

type IconProps = React.HTMLAttributes<SVGElement>;

export const VaultIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-4 w-4", className)}
    {...props}
  >
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" />
    <path d="M12 22V12" />
    <path d="M22 7L12 12L2 7" />
    <path d="M12 12L12 2" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" fill="currentColor" />
  </svg>
);
