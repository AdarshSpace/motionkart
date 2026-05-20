"use server"

import { cookies } from "next/headers";


export const getAllCourses = async () => {

    try {
        const cookieStore = await cookies();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course/getAll`, {
             headers: {
            cookie: cookieStore.toString(),
          },
          cache: "no-store",
        });

        const data = await response.json();

        if(!data.success){
            console.error("Response Error : ", data.error);
            return {error : data.error};
        }
        return data;

    } catch (error) {
        console.log(error);
    }
}   
