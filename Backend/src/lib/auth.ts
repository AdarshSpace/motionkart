import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from './DB.js';


export const auth = betterAuth({
     baseURL: process.env.BACKEND_URL,
    database: prismaAdapter(prisma, {
        provider: "mysql", 
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        }
    },
    emailAndPassword: { 
        enabled: true, 
      },


    trustedOrigins: [
        process.env.FRONTEND_URL_WWW as string,
        process.env.FRONTEND_URL as string,
        "http://localhost:3000",  // add if needed for dev
    ],


    advanced: {
    crossSubDomainCookies: {
        enabled: true,                    // ✅ was false — this was the bug
        domain: ".motionkart.online",     // ✅ dot prefix is important
    },
    defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        partitioned: true,                // ✅ add this too
    }
},

     user: {
         additionalFields: {
             role: {
                type: "string",
                required: true,
                defaultValue: "STUDENT",
              },
      
     },
       },
  
});