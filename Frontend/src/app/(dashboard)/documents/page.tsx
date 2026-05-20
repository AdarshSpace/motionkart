"use client";

import { useState, useEffect } from "react";
import { FileText, ExternalLink, BookOpen, Layers } from "lucide-react";
import { allDocuments } from "@/serverAction/documents";

interface NotesFile {
  videoId: string;
  videoTitle: string;
  moduleTitle: string;
  notesUrl: string;
}

interface CourseNotes {
  courseId: string;
  courseTitle: string;
  notes: NotesFile[];
}

export default function NotesPage() {
  const [courses, setCourses] = useState<CourseNotes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const {data} = await allDocuments();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch notes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#0039a6]/20 border-t-[#0039a6] animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading notes...</p>
        </div>
      </div>
    );
  }

  // check if user has no notes at all across all courses
  const totalNotes = courses.reduce((acc, c) => acc + c.notes.length, 0);

  return (
    <div className="bg-white rounded-3xl p-8 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Notes</h1>
        <p className="text-slate-400 font-medium mt-1">
          PDFs from your purchased courses
        </p>
      </div>

      {totalNotes === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
            <FileText className="w-7 h-7 text-[#0039a6]" />
          </div>
          <h5 className="font-extrabold text-slate-800 text-base mb-1.5">No notes available</h5>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
            Notes haven't been uploaded for any of your courses yet.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {courses
            .filter((course) => course.notes.length > 0) // skip courses with no notes
            .map((course) => (
              <div key={course.courseId}>

                {/* Course Title */}
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#0039a6] shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Course</p>
                    <h2 className="text-base font-extrabold text-slate-800 leading-none">{course.courseTitle}</h2>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {course.notes.length} {course.notes.length === 1 ? "file" : "files"}
                  </span>
                </div>

                {/* Notes Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {course.notes.map((note) => (
                    <div
                      key={note.videoId}
                      onClick={() => window.open(note.notesUrl, "_blank")}
                      className="group flex flex-col justify-between p-6 bg-slate-50 border border-gray-200 rounded-2xl cursor-pointer hover:border-[#0039a6]/40 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {/* Top */}
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center text-[#0039a6] shrink-0 group-hover:bg-[#0039a6] group-hover:text-white transition-all duration-300">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-[#0039a6] group-hover:border-[#0039a6]/30 transition-all duration-200 shrink-0">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Text */}
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-snug mb-2 line-clamp-2">
                          {note.videoTitle}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                          <Layers className="w-3 h-3 shrink-0" />
                          <span className="truncate">{note.moduleTitle}</span>
                        </div>
                      </div>

                      {/* Bottom */}
                      <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          PDF Document
                        </span>
                        <span className="text-[11px] font-semibold text-[#0039a6] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Open →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
        </div>
      )}

    </div>
  );
}