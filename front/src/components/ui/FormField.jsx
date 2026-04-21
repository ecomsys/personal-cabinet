import clsx from "clsx";

{/* 
  Продвинутый вариант использования

  <FormField label="Name" error="Required">
  {({ error }) => (
    <Input value={name} onChange={...} error={error} />
  )}
</FormField> */}

export default function FormField({
  label,
  error,
  children,
  className = "",
}) {
  // пробрасываем error в child (если это Input/Textarea)
  const child = typeof children === "function"
    ? children({ error })
    : children;

  return (
    <div className={clsx("w-full flex flex-col gap-1", className)}>
      {label && (
        <label className="text-sm text-gray-500">
          {label}
        </label>
      )}

      {child}

      <div className="min-h-[14px]">
        {error && (
          <span className="text-[11px] text-red-500 leading-tight">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}