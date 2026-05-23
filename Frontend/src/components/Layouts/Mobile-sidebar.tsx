"use client";

import { useState } from "react";
import { Menu, X, Home, PlaySquare, Folder, Bookmark, GraduationCap, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: PlaySquare, label: "Courses", path: "/courses" },
    { icon: Folder, label: "Documents", path: "/documents" },
    { icon: Bookmark, label: "Saved Videos", path: "/saved" },
  ];

  async function handleLogout() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      });
      router.refresh();
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.push("/login");
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 md:hidden text-slate-700 hover:bg-slate-100 rounded-lg"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0039a6] text-white flex flex-col pt-4 pb-6 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100/10">
            <GraduationCap className="w-5 h-5 text-white/70" />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-white/70 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1 px-4">
          {menuItems.map((item, index) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/" && pathname.startsWith(item.path));
            return (
              <Link
                key={index}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
