export default function InlineMetrics({ metrics = [], children }) {
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className="px-2 md:px-4 py-2.5 text-xs md:text-sm rounded-full border border-gray-300 bg-gray-50 text-gray-700 flex items-center gap-1"
        >
          <span className="text-gray-500">{m.label}:</span>
          <span className="font-medium">{m.value}</span>
        </div>
      ))}

      {children}
    </div>
  );
}
