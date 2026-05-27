export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  
  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-better-auth.session_token") || cookieStore.get("better-auth.session_token");
  if(token) {
    redirect("/home");
  }

  return (
    <>{children}</>    
  );
}