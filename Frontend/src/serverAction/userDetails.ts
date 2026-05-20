"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const fetchUser = async () => {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("better-auth.session_token");
        if(!token) {
          redirect("/login");
        }
    
        // fetch user details
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
          headers: {
            cookie: cookieStore.toString(),
          },
          cache: "no-store",   
        });

        const {details} = await res.json();
    
        if (!details) throw new Error("Failed to fetch user");
        
        return details;
    }catch(error) {
        console.log("Error fetching user details", error);
        return error as Error;
    }
}