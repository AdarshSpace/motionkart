"use client";

import { useState, useEffect } from "react";
import {UploadCard} from "@/components/Create_Course/uploadCard";
import { useParams } from "next/navigation";
import { randomUUID } from "crypto";
import { div } from "motion/react-client";
import { getCourse } from "@/serverAction/learn";


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
};


export default function EditCoursePage() {

  const params = useParams();

  const courseId = params.courseId;
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [sections, setSections] = useState<SectionType[]>([]);


  async function fetchCourse(courseId: string) {
    try {
      const {data} = await getCourse(courseId as string);

      console.log("data", data);

      setSections(data.modules.map((m, index) => (
        { 
             id: m.id,
             title: m.title,
             videos: m.videos,
             isExpanded: false,
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


  const updateSectionTitle = (
    sectionSID: string,
    title: string
  ) => {

    setSections((prev) =>
      prev.map((section) =>
        section.sid === sectionSID
          ? {
              ...section,
              title,
            }
          : section
      )
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


  const updateVideoTitle = (
    sectionSID: string,
    videoId: string,
    title: string
  ) => {

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


  const deleteVideo = (
    sectionSID: string,
    videoId: string
  ) => {

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


  const deleteSection = (sectionSID: string) => {

    setSections((prev) =>
      prev.filter((section) => section.sid !== sectionSID)
    );
  };



  return (
    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-4xl mx-auto space-y-5">

        <h1 className="text-3xl font-black">
          Course Builder
        </h1>

        {/* Sections */}

        {sections.map((section, sectionIndex) => (

          <div key={section.sid}
            className="bg-white border rounded-2xl overflow-hidden shadow-sm"
          >

            {/* Section Header */}

            <div onClick={() => toggleSection(section.sid)}
              className="flex items-center justify-between p-5 border-b cursor-pointer"
            >

              <div className="flex items-center gap-4 flex-1">

                <h2 className="font-black">
                  Section {sectionIndex + 1}
                </h2>

                <input type="text"
                  value={section.title}
                  onChange={(e) =>
                    updateSectionTitle(
                      section.sid,
                      e.target.value
                    )
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSection(section.sid);
                }}
                className="border px-3 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>

            {/* Videos */}

            {section.isExpanded && (

              <div className="p-5 space-y-4">

                {section.videos.map((video, videoIndex) => (

                  <div
                    key={video.id}
                    className="border rounded-xl p-4 flex items-center gap-4"
                  >

                    <span className="font-bold">
                      {videoIndex + 1}
                    </span>

                    <input type="text" value={video.title} onChange={(e) =>
                        updateVideoTitle(section.sid, video.id, e.target.value )
                      }
                      placeholder="Video Title"
                      className="border rounded-lg px-3 py-2 flex-1"
                    />

                    <button  onClick={() => deleteVideo(section.sid, video.id)}
                      className="border px-3 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                  
                ))}

                {/* Add Video */}

                <button
                  onClick={() => setIsUploadOpen(!isUploadOpen)}
                  className="border rounded-xl px-5 py-3"
                >
                  Add Video
                </button>
              </div>
            )}

           {isUploadOpen && (
             <UploadCard closeUploadModal={() => setIsUploadOpen(false)} addVideo={(video) => addVideo({video, sectionSID: section.sid})} sections={sections} section={section} courseId={courseId as string} />
           )}
          </div>

        ))}


        {/* Add Section */}

        <button
          onClick={addSection}
          className="w-full border-2 border-dashed rounded-2xl p-5 font-bold"
        >
          Add Section
        </button>

      </div>
    </div>
  );
}