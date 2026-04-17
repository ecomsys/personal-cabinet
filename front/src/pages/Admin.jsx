export default function Admin() {
  return (
    <div className="p-6">
      <div className="text-2xl font-semibold mb-4">
        Admin Panel
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <span className="text-red-600 font-medium">
          🔐 Admin access only
        </span>

        <p className="text-sm text-gray-500 mt-2">
          This is a protected admin area.
        </p>
      </div>
    </div>
  );
}