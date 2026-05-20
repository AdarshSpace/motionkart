"use server"

import { cookies } from "next/headers";

export const allDocuments = async () => {
    try{
         const cookieStore = await cookies();
            
         // fetch user Documents
         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course/notes`, {
           headers: {
             cookie: cookieStore.toString(),
           },
           cache: "no-store",   
         });

          const data = await res.json();

          if(!data.success){
            console.error("Response Error : ", data.error);
            return data.error;
          }

          return data;
    }
    catch(err){
        console.log(err);
        return null;
    }

}