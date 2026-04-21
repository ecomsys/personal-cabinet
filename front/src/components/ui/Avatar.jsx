import clsx from "clsx";

export default function Avatar({
  src,
  alt = "avatar",
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div
      className={clsx(
        "rounded-full overflow-hidden border-1 border-gray-300 bg-gray-200 flex items-center justify-center",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-500 text-sm">
          ?
        </span>
      )}
    </div>
  );
}