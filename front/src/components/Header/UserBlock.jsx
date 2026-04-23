import { useAuthStore } from "@/store/auth.store.js";
import { Icon } from "@/components/ui";
import { AVATAR_DEFAULT } from "../../config/exports";

export function UserBlock() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex items-center gap-3">
      {/* avatar */}
      <div className="relative">
        <img
          src={user?.avatarUrl || AVATAR_DEFAULT}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
        />

        {user?.role === "admin" && (
          <div className="absolute -top-1 -right-1 text-red-500 rounded-full">
            <Icon name="admin-badge" className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex flex-col leading-[1.1]">
        <span className="text-md font-medium">{user?.name || "No name"}</span>

        <span className="text-sm text-gray-400">
          {user?.status || "No status"}
        </span>
      </div>
    </div>
  );
}
