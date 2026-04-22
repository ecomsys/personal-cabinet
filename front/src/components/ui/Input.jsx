import clsx from "clsx";

export default function Input({
  className = "",
  error,
  ...props
}) {
  return (
    <input
      className={clsx(
        "w-full border border-gray-500 rounded px-4 py-2.5 text-sm outline-none transition",
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