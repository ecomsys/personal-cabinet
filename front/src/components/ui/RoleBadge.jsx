/* =========================
   ROLE BADGE
========================= */
export default function RoleBadge({ role }) {
  const isAdmin = role === "admin";

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        isAdmin ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
      }`}
    >
      {role}
    </span>
  );
}
