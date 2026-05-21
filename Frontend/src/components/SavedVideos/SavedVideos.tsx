"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Play, Layers, BookOpen, Clock, Trash2,} from "lucide-react";

import { deleteVideo } from "@/serverAction/savedVideo";

interface SavedVideo {
  savedId: string;
  savedAt: string;
  courseId: string;
  courseTitle: string;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  duration: number | null;
  moduleTitle: string;
}

function formatDuration(seconds: number | null) {
  if (!seconds) return "5 min";

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return s > 0 ? `${m}m ${s}s` : `${m} min`;
}

export default function SavedVideosGrid({ savedVideos}: { savedVideos: SavedVideo[] }) {

  const router = useRouter();

  const [videos, setVideos] = useState(savedVideos);

  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleRemove( e: React.MouseEvent, videoId: string, savedId: string ) {

    e.stopPropagation();

    setRemovingId(savedId);

    try {

      const data = await deleteVideo(videoId);

      if (data.success) {
        setVideos((prev) =>
          prev.filter((v) => v.savedId !== savedId)
        );
      }

    } catch (err) {
      console.error(err);

    } finally {
      setRemovingId(null);
    }
  }

  function handleOpen(video: SavedVideo) {
    router.push(
      `/courses/${video.courseId}/learn?videoId=${video.videoId}`
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

      {videos.map((video) => (

        <div
          key={video.savedId}
          onClick={() => handleOpen(video)}
          className="group relative flex flex-col justify-between p-5 bg-blue-100/20 backdrop-blur-xl border border-slate-300/80 rounded-2xl cursor-pointer hover:border-slate-300/60 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
        >

          {/* Top */}
          <div className="flex items-start justify-between gap-3 mb-4">

            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-[#0039a6] shrink-0 group-hover:bg-[#0039a6] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm shadow-blue-200">
              <Play className="w-4 h-4" />
            </div>

            <button
              onClick={(e) =>
                handleRemove(e, video.videoId, video.savedId)
              }
              disabled={removingId === video.savedId}
              className="opacity-0 group-hover:opacity-100 w-9 h-9 rounded-lg bg-white border border-slate-400 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 shrink-0"
            >
              {removingId === video.savedId ? (
                <span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">

            <p className="text-sm font-bold text-slate-900 leading-snug mb-3 line-clamp-2">
              {video.videoTitle}
            </p>

            <div className="flex flex-col gap-1.5">

              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg w-fit max-w-full">
                <BookOpen className="w-3 h-3 text-[#0039a6] shrink-0" />

                <span className="text-[11px] font-semibold text-[#0039a6] truncate">
                  {video.courseTitle}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg w-fit max-w-full">
                <Layers className="w-3 h-3 text-slate-500 shrink-0" />

                <span className="text-[11px] font-semibold text-slate-600 truncate">
                  {video.moduleTitle}
                </span>
              </div>

            </div>
          </div>

          {/* Bottom */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">

            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
              <Clock className="w-3 h-3" />
              {formatDuration(video.duration)}
            </div>

          </div>

          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none" />
        </div>
      ))}
    </div>
  );
}