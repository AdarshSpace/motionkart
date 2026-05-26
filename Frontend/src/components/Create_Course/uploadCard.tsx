"use client";

import { useState } from "react";
import { Upload, X, Video, FileText, Loader2,} from "lucide-react";
import { upload } from "@imagekit/next"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionType, VideoItem} from '@/app/(dashboard)/courses/[courseId]/edit/page'


type UploadCardProps = {
  closeUploadModal: () => void;

  section: SectionType;

  sections: SectionType[];

  courseId: string;

  addVideo: (
    video: VideoItem,
    sectionSID: string
  ) => void;
};

export const UploadCard = ({ closeUploadModal, addVideo, section, sections, courseId  }: UploadCardProps) => {

  const [formData, setFormData] = useState({title: "", description: ""});

  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [notesFile, setNotesFile] = useState<File | null>(null);

  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);



  const handleSubmit = async () => {

    if (!formData.title.trim()) {
      alert("Video title is required");
      return;
    }

    if (!videoFile) {
      alert("Please upload video file");
      return;
    }

    try {

      setIsSubmittingVideo(true);

      let uploadedNotesUrl = '';

      if (notesFile) {

      // Ask backend for ImageKit auth
        const authRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/video/auth`,{
          credentials: "include",
        });
        const data = await authRes.json();

        const uploadedPdf = await upload({
                    file: notesFile,
                    fileName: notesFile.name,
            
                    publicKey: data.publicKey,
                    expire: data.expire,
                    token: data.token,
                    signature: data.signature,
              });

      console.log("Uploaded PDF:", uploadedPdf);

     uploadedNotesUrl = uploadedPdf.url;
      }

      let data;

      if(videoFile){

    
              // STEP 1 → Get upload URL from backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/video/create`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    console.log(response)

      data = await response.json();

      console.log("Mux Data : ",data)

    if (!data.success) {
      throw new Error("Failed to create upload URL");
    }

    // STEP 2 → Upload directly to Mux
   const res = await fetch(data.uploadUrl, {
      method: "PUT",
      body: videoFile,
    });

    console.log("res : ", res);

      }
  
      const matchedSection = sections.find( (s) => s.sid === section.sid );

      if (!matchedSection) {
        alert("Section not found");
        return;
      }

      const payload = {
        id: matchedSection.id || null,
        title: matchedSection.title,
      
        videos: [
          {
            title: formData.title,
            description: formData.description,
            uploadId : data.uploadId,
            notesUrl: uploadedNotesUrl || null,
          },
        ],
      };
   

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course/update/${courseId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",          
              },
               credentials: "include",
              body: JSON.stringify(payload),
            });
            
      const result = await response.json();
      console.log('Result : ', result);
    


      const newVideo = {
        title: formData.title,
        description: formData.description,
        videoUrl: result.url || null,
        notesUrl: uploadedNotesUrl,
      };

      addVideo(newVideo, section.sid);

      console.log('newVideo : ', newVideo, ' sectionSID : ', section.sid);

      closeUploadModal();

 } catch (error) {

      console.log(error);

      alert("Failed to upload video");

    } finally {

      setIsSubmittingVideo(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}

        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#0039a6]" />
            </div>

            <h2 className="text-xl font-bold text-slate-800 tracking-tight"> Add Lesson </h2>
          </div>

          <button
            onClick={closeUploadModal}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}

        <div className="p-8 space-y-6">

          {/* Title */}

          <div className="space-y-2">

            <label className="text-sm font-semibold text-slate-700">
              Video Title <span className="text-red-500">*</span>
            </label>

            <Input
              placeholder="e.g. Overview of Next.js"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="h-12 text-sm border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0039a6] focus-visible:border-[#0039a6] rounded-xl"
            />
          </div>

          {/* Description */}

          <div className="space-y-2">

            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              placeholder="What will students learn in this video?"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0039a6] focus:border-[#0039a6] resize-none transition-all"
            />
          </div>

          {/* Video Upload */}

          <div className="space-y-2">

            <label className="text-sm font-semibold text-slate-700">
              Video File <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 focus-within:ring-1 focus-within:ring-[#0039a6] focus-within:border-[#0039a6] transition-all h-12">

              <Video className="w-5 h-5 text-slate-400 shrink-0" />

              <input
                type="file"
                accept="video/*"
                className="flex-1 text-sm outline-none bg-transparent file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0039a6] hover:file:bg-blue-100 cursor-pointer"
                onChange={(e) => { const file = e.target.files?.[0];
                     if (file) { setVideoFile(file) }
                }}               
              />
            </div>

            {videoFile && (
              <p className="text-xs text-slate-500"> {videoFile.name} </p>
            )}
          </div>

          {/* Notes Upload */}

        <div className="space-y-2">

            <label className="text-sm font-semibold text-slate-700">
              Notes / PDF File
            </label>

            <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 focus-within:ring-1 focus-within:ring-[#0039a6] focus-within:border-[#0039a6] transition-all h-12">

              <FileText className="w-5 h-5 text-slate-400 shrink-0" />

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => { const file = e.target.files?.[0];
                  if (file) { setNotesFile(file) }
                }}
                className="flex-1 text-sm outline-none bg-transparent file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
              />
          </div>

            {notesFile && (
              <p className="text-xs text-slate-500">
                {notesFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}

        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">

          <Button
            variant="outline"
            onClick={closeUploadModal}
            className="font-semibold border-slate-200 text-slate-600 hover:bg-white rounded-xl h-11 px-6"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmittingVideo}
            className="gap-2 bg-[#0039a6] hover:bg-[#002d85] text-white font-semibold rounded-xl h-11 px-6 shadow-sm transition-all disabled:opacity-60 disabled:scale-100"
          >
            {isSubmittingVideo ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}

            {isSubmittingVideo
              ? "Uploading..."
              : "Upload Lesson"}
          </Button>
        </div>
      </div>
    </div>
  );
};