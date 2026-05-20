import type { Request, Response } from "express";


export const getUser = async (req: Request, res: Response) => {
    try{
        const {name, email, role, id, image} = req.user as {name: string, email: string, role: string, id: string, image: string}
        
        if(!role || !email || !name || !id){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        
        return res.status(200).json({
            success: true,
            details: { name, email, role, id, image }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}