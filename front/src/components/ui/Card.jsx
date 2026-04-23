import clsx from "clsx";


export function PanelCard({ title, children }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

export function Card({
  children,
  className = "",
  ...props
}) {
  return (
    <div
      className={clsx(
        "p-4 md:p-6 bg-white rounded-xl shadow-lg",
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