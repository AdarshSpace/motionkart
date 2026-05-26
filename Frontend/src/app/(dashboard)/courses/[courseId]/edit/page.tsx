"use client";

import { useState, useEffect } from "react";
import { UploadCard } from "@/components/Create_Course/uploadCard";
import { useParams, useRouter } from "next/navigation";
import { getCourse } from "@/serverAction/learn";
import { 
  ArrowLeft, 
  Plus, 
  Video, 
  GripVertical, 
  Save, 
  Trash2,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export type VideoItem = {
  id?: string | null,
  title: string;
  description: string;
  videoUrl: string;
  notesUrl: string;
};

export type SectionType = {
  id?: string | null,
  sid: string;
  title: string;
  videos: VideoItem[];
  isExpanded: boolean;
  isSaved?: boolean;
};


export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId;

  const [sections, setSections] = useState<SectionType[]>([]);
  const [ courseTitle, setCourseTitle] = useState('')
  const [uploadModal, setUploadModal] = useState<{ isOpen: boolean; sectionSID: string | null }>({
    isOpen: false,
    sectionSID: null
  });


  async function fetchCourse(courseId: string) {
    try {
       const {data} = await getCourse(courseId as string);
       setCourseTitle(data.title);

      setSections(data.modules.map((m: any, index: number) => (
        { 
             id: m.id,
             title: m.title,
             videos: m.videos,
             isExpanded: false,
             isSaved: true,
             sid: `S${index + 1}` 
        }
      )));
     
    } catch (error) {
      console.log('Error : ', error);
    }
  }

  useEffect(() => {
    fetchCourse(courseId as string);
  }, [courseId]);


  const addSection = () => {
    const newSection: SectionType = {
      sid: `S${sections.length + 1}`,
      title: `Section ${sections.length + 1}`,
      videos: [],
      isExpanded: true,
      isSaved: false,
    };
    setSections((prev) => [...prev, newSection]);
  };

  const toggleSection = (sectionSID: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.sid === sectionSID
          ? {
              ...section,
              isExpanded: !section.isExpanded,
            }
          : section
      )
    );
  };

  const updateSectionTitle = (sectionSID: string, title: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.sid === sectionSID
          ? {
              ...section,
              title,
              isSaved: false
            }
          : section
      )
    );
  };

  const saveSection = (sectionSID: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.sid === sectionSID
          ? {
              ...section,
              isSaved: true
            }
          : section
      )
    );
  };

  const deleteSection = (sectionSID: string) => {
    setSections((prev) =>
      prev.filter((section) => section.sid !== sectionSID)
    );
  };

  const addVideo = ({video, sectionSID}: {video: VideoItem, sectionSID: string}): void => {
    const newVideo: VideoItem = {
      id: crypto.randomUUID(),
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      notesUrl: video.notesUrl,
    };

    setSections((prev) =>
      prev.map((section) =>
        section.sid === sectionSID
          ? {
              ...section,
              videos: [...section.videos, newVideo],
            }
          : section
      )
    );
  };

  const updateVideoTitle = (sectionSID: string, videoId: string, title: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.sid === sectionSID) {
          return {
            ...section,
            videos: section.videos.map((video) =>
               video.id === videoId
                ? {...video, title,} : video
            ),
          };
        }
        return section;
      })
    );
  };

  const deleteVideo = (sectionSID: string, videoId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.sid === sectionSID
          ? {
              ...section,
              videos: section.videos.filter(
                (video) => video.id !== videoId
              ),
            }
          : section
      )
    );
  };

  const openUploadModal = (sectionSID: string) => {
    setUploadModal({ isOpen: true, sectionSID });
  };

  const closeUploadModal = () => {
    setUploadModal({ isOpen: false, sectionSID: null });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/courses')}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{courseTitle}</h1>
              <p className="text-sm text-slate-500">Course ID: {courseId}</p>
            </div>
          </div>
         
        </div>

        {/* Sections List */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <Card key={section.sid} className="border-slate-200 py-0 shadow-sm overflow-hidden">
              {/* Section Header */}
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between group transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-slate-200 shrink-0" onClick={() => toggleSection(section.sid)}>
                    {section.isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </Button>
                  {/* <GripVertical className="w-5 h-5 text-slate-400 cursor-grab active:cursor-grabbing" /> */}
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <span className="text-sm font-bold text-slate-500 cursor-pointer" onClick={() => toggleSection(section.sid)}>Section {sectionIndex + 1}:</span>
                    <Input 
                      value={section.title}
                      onChange={(e) => updateSectionTitle(section.sid, e.target.value)}
                      className="font-semibold text-slate-800 bg-transparent border-transparent hover:border-slate-300 focus:border-[#0039a6] focus:bg-white transition-all h-8"
                    />
                    {!section.isExpanded && section.isSaved && (
                      <span className="text-xs font-semibold text-slate-400 text-nowrap ml-2">
                        {section.videos.length} {section.videos.length === 1 ? 'video' : 'videos'}
                      </span>
                    )}
                  </div>
                  {!section.isSaved && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => saveSection(section.sid)}
                      className="h-8 gap-1 ml-2 border-slate-200 text-[#0039a6] bg-blue-50 hover:bg-blue-100 hover:text-[#002d85] shadow-sm font-bold"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Section
                    </Button>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteSection(section.sid)}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Videos List */}
              {section.isExpanded && (
                <CardContent className="p-0">
                  {section.isSaved ? (
                    <>
                      {section.videos.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {section.videos.map((video) => (
                            <div key={video.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group/video">
                              <div className="flex items-center gap-4 flex-1">
                                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab active:cursor-grabbing" />
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                  <Video className="w-4 h-4 text-[#0039a6]" />
                                </div>
                                <div className="flex-1 max-w-sm">
                                  <Input 
                                    value={video.title}
                                    onChange={(e) => updateVideoTitle(section.sid, video.id as string, e.target.value)}
                                    className="text-sm font-medium text-slate-700 bg-transparent border-transparent hover:border-slate-300 focus:border-[#0039a6] focus:bg-white transition-all h-8"
                                    placeholder="Video Title"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => deleteVideo(section.sid, video.id as string)}
                                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 opacity-0 group-hover/video:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-500 text-sm">
                          No videos added to this section yet.
                        </div>
                      )}

                      {/* Upload Video Button */}
                      <div className="p-4 bg-white border-t border-slate-100">
                        <Button 
                          variant="ghost" 
                          onClick={() => openUploadModal(section.sid)}
                          className="gap-2 text-[#0039a6] hover:bg-blue-50 hover:text-[#002d85] font-semibold text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Lesson
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-500 text-sm border-t border-slate-100">
                      Please save this section first to start uploading videos.
                    </div>
                  )}
                </CardContent>
              )}

              {/* Conditional rendering of UploadCard for this section */}
              {uploadModal.isOpen && uploadModal.sectionSID === section.sid && (
                 <UploadCard 
                    closeUploadModal={closeUploadModal} 
                    addVideo={(video) => {
                      addVideo({video, sectionSID: section.sid});
                      closeUploadModal();
                    }} 
                    sections={sections} 
                    section={section} 
                    courseId={courseId as string} 
                 />
              )}
            </Card>
          ))}

          {/* Add Section Button */}
          <Button 
            variant="outline" 
            size="lg"
            onClick={addSection}
            className="w-full gap-2 border-dashed border-2 border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800 h-16 rounded-xl font-bold"
          >
            <Plus className="w-5 h-5" />
            Add New Section
          </Button>
        </div>
      </div>
    </div>
  );
}