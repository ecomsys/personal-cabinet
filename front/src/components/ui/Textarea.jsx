import clsx from "clsx";

export default function Textarea({
  className = "",
  error,
  ...props
}) {
  return (
    <textarea
      className={clsx(
        "w-full border border-gray-400 rounded-xl px-3 py-2 text-sm outline-none transition resize-none",
        "focus:ring-2 focus:ring-teal-900/20 focus:border-teal-800",

        // error state
        error && "border-red-500 focus:ring-red-200 focus:border-red-500",

        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}