export default function Input({
  placeholder,
  name,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="relative w-full">
      <input
        placeholder={placeholder}
        name={name}
        className={`
          border w-full p-2 rounded-lg border-gray-300 text-gray-700
          focus:outline-none focus:ring-1 focus:ring-teal-400
          transition
          ${error ? "border-red-500 focus:ring-red-400" : ""}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="absolute left-0 top-full mt-1 text-red-500 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
