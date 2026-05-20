import { User, Session } from "better-auth";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: "ADMIN" | "STUDENT" | "TEACHER";
      };
      session?: Session;
    }
  }
}

export {};