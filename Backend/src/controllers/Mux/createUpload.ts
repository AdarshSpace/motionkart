import type { Request, Response } from "express";
import { mux } from "../../lib/mux.js";

export const handleCreateUploadUrl = async ( req: Request, res: Response ) => {
  try {
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
      },

      cors_origin: process.env.FRONTEND_URL!,
    });

    console.log("Upload : ", upload);

    res.status(200).json({
      success: true,
      uploadId: upload.id,
      uploadUrl: upload.url,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create upload URL",
    });
  }
};