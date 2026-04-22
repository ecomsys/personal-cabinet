import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store.js";
import { useModalStore } from "@/store/modal.store.js";
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/config/navigation";
import { Icon, Button } from "@/components/ui";

export default function Sidebar({ mobileOpen, onClose }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const openConfirm = useModalStore((s) => s.openConfirm);

  const handleLogout = () => {
    openConfirm({
      title: "Logout",
      description: "Are you sure you want to logout?",
      onConfirm: logout,
    });
  };

  const isActive = (path) => location.pathname === path;

  const items = [
    ...NAV_ITEMS,
    ...(user?.role === "admin" ? ADMIN_NAV_ITEMS : []),
  ];

  const linkClass = (active) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-md font-medium leading-[1] tracking-[0.03em] transition ${
      active ? "bg-white text-black" : "text-gray-300 hover:bg-teal-800"
    }`;

  return (
    <>
      {/* overlay mobile */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`flex flex-col
          bg-teal-700 text-white p-4
          w-64 fixed top-0 h-full z-50
          transition-all duration-200

          ${mobileOpen ? "right-0" : "-right-64"}         
          md:relative md:left-0 md:h-screen md:block
        `}
      >
        {/* close button mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            className="text-white/80 hover:text-white cursor-pointer"
            onClick={onClose}
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={linkClass(isActive(item.path))}
            >
              <Icon name={item.icon} className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="inline-flex md:hidden mt-auto w-full">
            <Button variant="danger" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
