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
      trustedOrigins: [process.env.FRONTEND_URL!, process.env.FRONTEND_URL_WWW!], 
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