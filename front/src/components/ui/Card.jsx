import clsx from "clsx";

export function Card({
  children,
  className = "",
  ...props
}) {
  return (
    <div
      className={clsx(
        "bg-white border rounded-xl shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}) {
  return (
    <div className={clsx("px-4 py-3 border-b", className)}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}) {
  return (
    <div className={clsx("p-4", className)}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
}) {
  return (
    <div className={clsx("px-4 py-3 border-t", className)}>
      {children}
    </div>
  );
}