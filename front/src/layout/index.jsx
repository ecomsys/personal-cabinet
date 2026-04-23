import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-[100dvh]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onBurger={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-auto p-3 md:p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
