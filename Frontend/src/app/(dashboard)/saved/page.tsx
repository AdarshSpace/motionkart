import { Bookmark } from "lucide-react";
import { getAllSavedVideos } from "@/serverAction/savedVideo";

import SavedVideosGrid from "../../../components/SavedVideos/SavedVideos";

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

export default async function SavedVideosPage() {

  const { data } = await getAllSavedVideos();

  const savedVideos: SavedVideo[] = data;

  return (
    <div className="bg-white h-full rounded-3xl p-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Saved Videos
        </h1>

        <p className="text-slate-400 font-medium mt-1">
          {savedVideos.length === 0
            ? "No saved videos yet"
            : `${savedVideos.length} ${
                savedVideos.length === 1 ? "video" : "videos"
              } saved`}
        </p>
      </div>

      {savedVideos.length === 0 ? (

        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">

          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
            <Bookmark className="w-7 h-7 text-[#0039a6]" />
          </div>

          <h5 className="font-extrabold text-slate-800 text-base mb-1.5">
            Nothing saved yet
          </h5>

          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
            Hit the Save button on any lesson to bookmark it here for quick revision.
          </p>
        </div>

      ) : (

        <SavedVideosGrid savedVideos={savedVideos} />

      )}
    </div>
  );
}