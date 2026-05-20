"use server"

import { cookies } from "next/headers";


export const getCourse = async (courseId: string) => {
    try{
        const cookieStore = await cookies();
        const response =  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course/${courseId}/curriculum`, {
            headers: {
                cookie: cookieStore.toString(),  
            }
        });

        const data = await response.json();

        if(!data.success){
            return data.error;
        }

        return data;
    }
    catch(err){
        console.log(err);
        return null;
    }

}

export const getChatHistory = async (courseId: string, videoId: string) => {
    try{
        const cookieStore = await cookies();
        const response =  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/fetch/${courseId}/${videoId}`, {
            headers: {
                cookie: cookieStore.toString(),  
            }
        });

        const data = await response.json();
        console.log("Data from getChatHistory : ", data);

        if(!data.success){
            return data.error;
        }

        return data;
    }
    catch(err){
        console.log(err);
        return null;
    }

}

export const sendChat = async (courseId: string, videoId: string, question: string) => {
    try{
        console.log("from server action sendChat : ", question, courseId, videoId)
        const cookieStore = await cookies();
        const response =  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/ask`, {
            method: "POST",
            headers: {
                cookie: cookieStore.toString(),  
                "content-type": "application/json",
            },
            body: JSON.stringify({question, courseId, videoId}),
        });

        const data = await response.json();

        console.log("Data from sendChat : ", data);

        if(!data.success){
            return data.error;
        }

        return data;
    }
    catch(err){
        console.log(err);
        return null;
    }

}
