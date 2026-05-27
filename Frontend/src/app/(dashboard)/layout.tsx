export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Header } from "../../components/Layouts/Header";
import { Sidebar } from "../../components/Layouts/Side-bar";




export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const cookieStore = await cookies();
  const token =
    cookieStore.get("__Secure-better-auth.session_token") ||
    cookieStore.get("better-auth.session_token");

  if(!token) {
    redirect("/login");
  }


  return (
      <div className="flex min-h-screen bg-[#f8fafc]">
          <Sidebar/>
                      
          {/* Main Content Area */}
          <div className="flex min-w-0 flex-1 flex-col pl-0 md:pl-20 transition-all duration-300">
            <Header/>
            <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto overflow-x-hidden">
              {children}
            </main>
          </div>
      </div>
    );
}