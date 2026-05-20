import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });
    
        if (!session) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized",
          });
        }

        req.user = session.user as any
        
        console.log("Moving towards next ...")
    
        next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};