import clsx from "clsx";

export default function Textarea({
  className = "",
  error,
  ...props
}) {
  return (
    <textarea
      className={clsx(
        "w-full border rounded px-3 py-2 text-sm outline-none transition resize-none",
        "focus:ring-2 focus:ring-black/20 focus:border-black",

        // error state
        error && "border-red-500 focus:ring-red-200 focus:border-red-500",

        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}