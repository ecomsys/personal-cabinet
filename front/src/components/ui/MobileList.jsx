// components/ui/MobileList.jsx
export default function MobileList({ items = [], renderItem }) {
  if (!items.length) return null;

  return (
    <div className="space-y-3 md:hidden">
      {items.map((item) => (
        <div key={item.id} className="border border-gray-300 rounded-xl p-3 bg-white">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
