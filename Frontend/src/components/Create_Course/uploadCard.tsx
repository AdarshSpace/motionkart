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

      // Ask backend for ImageKit auth
        const authRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/video/auth`,{
          credentials: "include",
        });
        const data = await authRes.json();
 
        const res = await upload({
          file: videoFile,
          fileName: videoFile.name,
          publicKey: data.publicKey,
          expire: data.expire,
          token: data.token,
          signature: data.signature,
          onProgress: (event: ProgressEvent) => {
            if (event.lengthComputable) {
              const percent = Math.round(
                (event.loaded / event.total) * 100
              );
            //   onProgress(percent);
            }
          },
        });

        console.log('Uploaded video : ', res);


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
            videoUrl: res.url,
            videoPath: res.filePath,
            videoDuration: res.duration,
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
        videoUrl: result.url,
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Upload className="w-4 h-4 text-[#0039a6]" />
            </div>

            <h2 className="text-base font-extrabold text-slate-800 tracking-tight"> Add Video </h2>
          </div>

          <button
            onClick={closeUploadModal}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-4">

          {/* Title */}

          <div className="space-y-1.5">

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Video Title <span className="text-red-400">*</span>
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
              className="h-10 text-sm border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0039a6] focus-visible:border-[#0039a6] rounded-xl"
            />
          </div>

          {/* Description */}

          <div className="space-y-1.5">

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Description
            </label>

            <textarea
              placeholder="What will students learn in this video?"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full min-h-[72px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0039a6] focus:border-[#0039a6] resize-none transition-all"
            />
          </div>

          {/* Video Upload */}

          <div className="space-y-1.5">

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Video File <span className="text-red-400">*</span>
            </label>

            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 focus-within:ring-1 focus-within:ring-[#0039a6] focus-within:border-[#0039a6] transition-all">

              <Video className="w-4 h-4 text-slate-400 shrink-0" />

              <input
                type="file"
                className="flex-1 h-10 text-sm outline-none bg-transparent"
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

        <div className="space-y-1.5">

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Notes / PDF File
            </label>

            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 focus-within:ring-1 focus-within:ring-[#0039a6] focus-within:border-[#0039a6] transition-all">

              <FileText className="w-4 h-4 text-slate-400 shrink-0" />

              <input
                type="file"
                onChange={(e) => { const file = e.target.files?.[0];
                  if (file) { setNotesFile(file) }
                }}
                className="flex-1 h-10 text-sm outline-none bg-transparent"
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

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">

          <Button
            variant="outline"
            size="sm"
            onClick={closeUploadModal}
            className="font-bold border-slate-200 text-slate-600 hover:bg-white rounded-xl h-9 px-4"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmittingVideo}
            className="gap-2 bg-[#0039a6] hover:bg-[#002d85] text-white font-bold rounded-xl h-9 px-5 shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:scale-100"
          >
            {isSubmittingVideo ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}

            {isSubmittingVideo
              ? "Saving..."
              : "Save Video"}
          </Button>
        </div>
      </div>
    </div>
  );
};