import clsx from "clsx";

export default function Tabs({ tabs = [], value, onChange }) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => {
        const active = tab.value === value;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={clsx(
              "px-4 py-2 text-sm border-b-2 transition cursor-pointer",
              "whitespace-nowrap",
              active
                ? "border-black text-black font-medium"
                : "border-transparent text-gray-500 hover:text-black",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
