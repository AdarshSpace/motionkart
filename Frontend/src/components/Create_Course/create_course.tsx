"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { upload } from "@imagekit/next";
import Body from "./Body";
import { useForm } from "react-hook-form";


type Props = {
  open: boolean;
  onClose: () => void;
};

export type CreateCourseInput = {
  title: string;
  description: string;
  category: string;
  price: number;
  oldPrice: number;
  thumbnail: File;
  handleThumbnailChange: File;
}

export function CreateCourseModal({ open, onClose }: Props) {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<CreateCourseInput>();

  if (!open) return null;

  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];
  
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
  const MIN_WIDTH = 1280;
  const MIN_HEIGHT = 720;
  const EXPECTED_RATIO = 16 / 9;
  const RATIO_TOLERANCE = 0.05;
  
  const validateThumbnail = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      // type validation
      if (!ALLOWED_TYPES.includes(file.type)) {
        resolve("Only JPG, JPEG, PNG, WEBP, AVIF are allowed");
        return;
      }
  
      // file size validation
      if (file.size > MAX_FILE_SIZE) {
        resolve("Thumbnail must be under 15MB");
        return;
      }
  
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
  
      img.onload = () => {
        const width = img.width;
        const height = img.height;
  
        // minimum dimension validation
        if (width < MIN_WIDTH || height < MIN_HEIGHT) {
          URL.revokeObjectURL(objectUrl);
          resolve("Minimum image size is 1280×720");
          return;
        }
  
        // aspect ratio validation
        const ratio = width / height;
  
        if (Math.abs(ratio - EXPECTED_RATIO) > RATIO_TOLERANCE) {
          URL.revokeObjectURL(objectUrl);
          resolve("Thumbnail must be in 16:9 ratio");
          return;
        }
  
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
  
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve("Invalid image file");
      };
  
      img.src = objectUrl;
    });
  };

  const handleThumbnailChange = async (file : File | null ) => {
    console.log('File : ',file);
    if (!file) return;
    const error = await validateThumbnail(file);

    console.log(error)
  
    if (error) {  
      setThumbnail(null);
      setError("root", {  type: "thumbnail",  message: error,});
      return;     
    }

    setThumbnail(file)
  };

  const onSubmit = async (data: CreateCourseInput) => {
     console.log( data.title, data.description, data.category, data.price, data.oldPrice );
    if (!thumbnail) {
      setError("root", { type: "server", message: "Please upload thumbnail" });
      return;
    }

    setIsLoading(true);
    try {
          console.log('Thumbnail : ',thumbnail)
      // Ask backend for ImageKit auth
      const authRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/video/auth`,{
        credentials: "include",        
        });
      console.log('Auth Res : ', authRes);
      const authData = await authRes.json();


      const res = await upload({
        file: thumbnail,
        fileName: thumbnail.name,
        publicKey: authData.publicKey,
        expire: authData.expire,
        token: authData.token,
        signature: authData.signature,
        onProgress: (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const percent = Math.round(
              (event.loaded / event.total) * 100
            );
          //   onProgress(percent);
          }
        },
      });

      console.log('Uploaded image : ', res);

      console.log( data.title, data.description, data.category, data.price, data.oldPrice, res.url);

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course/create`,
        {
          method: "POST",
          credentials: "include", // ✅ browser sends cookie automatically
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({title: data.title,
            description: data.description,
            category: data.category,
            price: data.price as number,
            oldPrice: data.oldPrice as number,
            thumbnail: res.url as string,}),
        }
      );

      

      console.log('Course created : ', result);

      onClose();

  }
  catch (err) {
    console.log("Upload failed:", err);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4  backdrop-blur-sm">
      <div className="w-full max-w-2xl h-[75vh] rounded-[28px] bg-white shadow-2xl overflow-y-auto scrollbar-hide p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Create New Course
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add your course basic information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
        <Body thumbnail={thumbnail}  handleThumbnailChange={handleThumbnailChange} register={register} errors={errors}  />

        {/* Footer */}
        <div className="flex gap-4 border-t border-slate-200 px-6 py-5">

          <button
          type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            disabled={isLoading}
          >
            Cancel
          </button>

        <button 
          className="flex-1 rounded-2xl bg-[#0039a6] py-3 font-semibold text-white transition hover:bg-[#002d84] disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit" 
          disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Course"}
          </button>

          
        </div>
        </form>
      </div>
    </div>
  );
}