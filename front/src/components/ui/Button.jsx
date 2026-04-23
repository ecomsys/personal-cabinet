import clsx from "clsx";
import { Spinner } from "@/components/ui";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "", 
  ...props
}) {
  const baseStyles =
    "cursor-pointer inline-flex items-center justify-center font-medium rounded-xl transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-black hover:bg-gray-100",
  };

  const sizes = {
    icon: "text-sm px-2 py-2",
    sm: "text-sm px-3 py-2",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-5 py-3.5",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" className="text-white" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}