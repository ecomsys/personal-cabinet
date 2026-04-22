import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui";
import { useModalStore } from "@/store/modal.store.js";
import { Icon } from "@/components/ui";

import { UserBlock } from "./UserBlock";
import { Breadcrumbs } from "../Header/Breadcrumbs";

export default function Header({ onBurger }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const openConfirm = useModalStore((s) => s.openConfirm);

  const handleLogout = () => {
    openConfirm({
      title: "Logout",
      description: "Are you sure you want to logout?",
      onConfirm: logout,
    });
  };

  return (
    <header className="bg-white">
      {/* LEFT */}

      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
        <UserBlock user={user} />

        {/* RIGHT */}
        <div className="flex items-centger gap-5">
          <div className="hidden md:inline-flex">
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          {/* burger (mobile only) */}
          <button
            className="md:hidden text-black hover:text-gray-700 cursor-pointer"
            onClick={onBurger}
          >
            <Icon name="burger" className="w-6 h-6" />
          </button>
        </div>
      </div>

      <Breadcrumbs className="py-1.5 px-6"/>
    </header>
  );
}
