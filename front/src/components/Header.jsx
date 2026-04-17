import { useAuthStore } from "../store/auth.store";
import { AdminBadge } from "@/components/ui";

export const Header = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
      
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user?.email}</span>
        <span className="text-xs text-gray-400">
          {user?.role || "user"}
        </span>
        {user?.role === "admin" && <AdminBadge />}
      </div>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
      >
        Logout
      </button>
    </div>
  );
};