"use server"

import { cookies } from "next/headers";

export const getAllSavedVideos = async () => {
    try{
         const cookieStore = await cookies();
            
         // fetch user Documents
         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/saveVideo/saved`, {
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

export const deleteVideo = async (videoId: string) => {
    try{
         const cookieStore = await cookies();
            
         // remove the saved video
         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/saveVideo/saved/${videoId}`, {
           method: "DELETE",  
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
