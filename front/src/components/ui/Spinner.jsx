import clsx from "clsx";

export default function Spinner({
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "w-3 h-3 border-2",
    md: "w-4 h-4 border-2",
    lg: "w-6 h-6 border-[3px]",
  };

  return (
    <div
      className={clsx(
        "rounded-full border-current border-t-transparent animate-spin",
        sizes[size],
        className
      )}
    />
  );
}