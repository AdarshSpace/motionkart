import { User } from "lucide-react";
import { fetchUser } from "@/serverAction/userDetails";
import { MobileSidebar } from "./Mobile-sidebar";

export async function Header() {

  const userData = await fetchUser();




  return (
    <header className="h-20 bg-white border-b border-slate-300 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <MobileSidebar />
      </div>
      <div className="flex items-center gap-3 group">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">{userData.name}</p>
          <p className="text-xs text-muted-foreground">{userData.email}</p>
        </div>
        {userData.image ? (
      <img
        src={userData.image}
        alt={userData.name}
        className="w-10 h-10 rounded-full object-cover border border-gray-200"
      />
    ) : (
      <User
        size={30}
        strokeWidth={2}
        className="text-muted-foreground rounded-full bg-gray-200 p-1.5"
      />
    )}
        </div>
    </header>
  );
}