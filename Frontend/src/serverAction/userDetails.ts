"use server";

import { cookies } from "next/headers";

export const fetchUser = async () => {
    try{
        const cookieStore = await cookies();
    
        // fetch user details
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
          headers: {
            cookie: cookieStore.toString(),
          },
          cache: "no-store",   
        });

        const {details} = await res.json();
        console.log('Details from server action : ',details);
    
        if (!details) throw new Error("Failed to fetch user");
        
        return details;
    }catch(error) {
        console.log("Error fetching user details", error);
        return error as Error;
    }
}