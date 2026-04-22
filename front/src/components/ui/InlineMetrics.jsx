export default function InlineMetrics({ metrics = [] }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className="px-4 py-2.5 text-sm rounded-full border border-gray-300 bg-gray-50 text-gray-700 flex items-center gap-1"
        >
          <span className="text-gray-500">{m.label}:</span>
          <span className="font-medium">{m.value}</span>
        </div>
      ))}
    </div>
  );
}