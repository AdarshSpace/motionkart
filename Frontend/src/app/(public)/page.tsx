export const dynamic = "force-dynamic";
import LandingPage from "@/components/LandingPage/LandingPage";
import { cookies } from "next/headers";

export default async function Page() {

  const cookieStore = await cookies();
  const token =
    cookieStore.get("__Secure-better-auth.session_token") ||
    cookieStore.get("better-auth.session_token");
  const authenticated = token? true : false;
  
  return <LandingPage authenticated={authenticated} />
}