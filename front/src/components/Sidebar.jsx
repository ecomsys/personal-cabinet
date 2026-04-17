import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export const Sidebar = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (active) =>
    `block px-3 py-2 rounded-lg text-sm transition ${
      active ? "bg-white text-black" : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="w-64 bg-black text-white p-4">
      <h2 className="text-xl font-semibold mb-6">Cabinet</h2>

      <nav className="flex flex-col gap-2">
        <Link to="/" className={linkClass(isActive("/"))}>
          Dashboard
        </Link>

        {user?.role === "admin" && (
          <Link to="/admin" className={linkClass(isActive("/admin"))}>
            Admin Panel
          </Link>
        )}

        <Link to="/profile" className={linkClass(isActive("/profile"))}>
          Profile
        </Link>
      </nav>
    </div>
  );
};