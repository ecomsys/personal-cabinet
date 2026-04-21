export default function UserInfoBlock({ user }) {
  return (
    <div className="flex items-center gap-3">

      <img
        src={user?.avatarUrl || "/images/source/default-avatar.png"}
        className="w-9 h-9 rounded-full object-cover"
      />

      <div className="flex flex-col leading-tight">

        <span className="text-sm font-medium">
          {user?.name || "No name"}
        </span>

        <span className="text-xs text-gray-400">
          {user?.status || "No status"}
        </span>

      </div>

      {/* ROLE BADGE */}
      <div className="ml-2">
        {user?.role === "admin" ? (
          <span className="text-xs px-2 py-1 bg-black text-white rounded flex items-center gap-1">
            🔑 Admin
          </span>
        ) : (
          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
            User
          </span>
        )}
      </div>

    </div>
  );
}