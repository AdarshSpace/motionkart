
"use client";

import { Home, PlaySquare, Folder, User, Settings, LogOut, FileVideo, SaveIcon, Bookmark, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: PlaySquare, label: "Courses", path: "/courses" },
    { icon: Folder, label: "Documents", path: "/documents" },
    { icon: Bookmark, label: "Saved Videos", path: "/saved" },
    // { icon: User, label: "Profile", path: "/profile" },
    // { icon: Settings, label: "Settings", path: "/settings" },
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
    router.push("/login"); // always redirect even if request fails
  }
}

  return (
    <div className="hidden md:flex w-20 bg-[#0039a6] h-screen fixed left-0 top-0 flex-col items-center pt-4 pb-6 text-white z-50">

        {/* Logo 1 */}
      <div className="mb-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100/10">
          <GraduationCap className="w-6 h-6 text-white/70"/>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-6 flex-1">
        {menuItems.map((item, index) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/" && pathname.startsWith(item.path));
          return (
            <Link
              key={index}
              href={item.path}
              title={item.label}
              aria-label={item.label}
              className={`w-12 h-12 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center ${
                isActive
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-6 h-6" />
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          type="button"
          title="Logout"
          aria-label="Logout"
          onClick={handleLogout}
          className="w-12 h-12 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}