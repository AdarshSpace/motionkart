"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { getChatHistory, sendChat } from "@/serverAction/learn";

import MuxPlayer from "@mux/mux-player-react";

import { Play, CheckCircle, Download, FileText, MessageSquare, Bookmark, Share2, SendHorizontal, Sparkles,
     Bot, User, BookOpen, Loader2, AlertCircle, NavigationIcon,} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";

interface Props {
  courseId: string;
  initialCourseData: any;
  initialLesson: any;
  initialMessages: any[];
}

interface ChatMessage {
  role: "USER" | "ASSISTANT";
  text: string;
  sources?: any[];
}

export default function CoursePlayerClient({ courseId, initialCourseData, initialLesson, initialMessages,}: Props) {

  const router = useRouter();

  // ── State ──
  const [courseData] = useState(initialCourseData);

  const [activeLesson, setActiveLesson] = useState(initialLesson);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);

  const [chatInput, setChatInput] = useState("");

  const [chatLoading, setChatLoading] = useState(false);

  const [chatError, setChatError] = useState<string | null>( null);

  const [copied, setCopied] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);

  // ── Streaming ──
  const [streamingText, setStreamingText] = useState("");

  const [isStreaming, setIsStreaming] = useState(false);

  const pendingSourcesRef = useRef<any[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Auto scroll ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages, streamingText]);

  // ── Load chat when lesson changes ──
  useEffect(() => {
    if (!activeLesson?.id) return;

    const fetchChat = async () => {
      try {
        const data = await getChatHistory(
          courseId,
          activeLesson.id
        );

        if (data.success) {
          setChatMessages(data.messages || []);
        } else {
          setChatMessages([]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchChat();
  }, [activeLesson?.id]);

  // ── Animate AI response ──
  function animateResponse(text: string) {
    setIsStreaming(true);

    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        setStreamingText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);

        setIsStreaming(false);

        setChatMessages((prev) => [
          ...prev,
          {
            role: "ASSISTANT",
            text,
            sources: pendingSourcesRef.current,
          },
        ]);

        setStreamingText("");

        pendingSourcesRef.current = [];
      }
    }, 12);
  }

  // ── Send chat ──
  async function sendChatMessage() {
    const question = chatInput.trim();

    if (!question || chatLoading) return;

    setChatInput("");

    setChatMessages((prev) => [
      ...prev,
      {
        role: "USER",
        text: question,
      },
    ]);

    setChatLoading(true);

    try {
      const data = await sendChat(
        courseId,
        activeLesson.id,
        question
      );

      pendingSourcesRef.current = data.sources || [];

      animateResponse(data.answer);
    } catch (err: any) {
      setChatError(err.message);
    } finally {
      setChatLoading(false);
    }
  }

  // ── Share ──
  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}?videoId=${activeLesson?.id}`;

    await navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }



  // ── Save state check ──
  useEffect(() => {
    if (!activeLesson?.id) return;

    const checkSaved = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/saveVideo/saved/${activeLesson.id}/check`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        setIsSaved(data.isSaved ?? false);
      } catch {
        setIsSaved(false);
      }
    };

    checkSaved();
  }, [activeLesson?.id]);

  // ── Save video ──
  async function handleSave() {
    if (!activeLesson?.id) return;

    setSaveLoading(true);

    try {
      if (isSaved) {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/saveVideo/saved/${activeLesson.id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        setIsSaved(false);
      } else {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/saveVideo/save`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              videoId: activeLesson.id,
              courseId,
            }),
          }
        );

        setIsSaved(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSaveLoading(false);
    }
  }

  // ── Markdown ──
  const markdownComponents = {
    p: ({ children }: any) => (
      <p className="mb-2">{children}</p>
    ),
  };

  return (
    <div>
      {/* VIDEO */}
      <div className="w-full bg-black relative shadow-2xl rounded-2xl overflow-hidden">
        <div className="aspect-video relative w-full h-full">
          <MuxPlayer
            playbackId={activeLesson?.muxPlaybackId}
            thumbnailTime={21}
            streamType="on-demand"
            className="w-full h-full"
            style={{
              '--media-primary-color': '#FFFFFF',
              '--media-accent-color': '#3b82f6',
            }}
          />
        </div>
      </div>

      {/* TITLE */}
      <div className="flex items-center justify-between mt-6">
        <div>
          <h1 className="text-2xl font-bold">
            {activeLesson?.title}
          </h1>

          <p>{courseData?.title}</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave}>
            {saveLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Bookmark className="w-4 h-4 mr-2" />
                {isSaved ? "Saved" : "Save"}
              </>
            )}
          </Button>

          <Button onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />

            {copied ? "Copied!" : "Share"}
          </Button>
        </div>
      </div>

      {/* TABS */}
      <Tabs
        defaultValue="description"
        className="mt-10"
      >
        <TabsList>
          <TabsTrigger value="description">
            Description
          </TabsTrigger>

          <TabsTrigger value="resources">
            Resources
          </TabsTrigger>

          <TabsTrigger value="doubt">
            Ask Doubt
          </TabsTrigger>
        </TabsList>

        {/* DESCRIPTION */}
        <TabsContent value="description">
          <div className="mt-6">
            <p>{activeLesson?.description}</p>
          </div>
        </TabsContent>

        {/* RESOURCES */}
        <TabsContent value="resources">
          <div className="mt-6">
            {activeLesson?.notesUrl ? (
              <a
                href={activeLesson.notesUrl}
                target="_blank"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Open Notes
              </a>
            ) : (
              <p>No resources available.</p>
            )}
          </div>
        </TabsContent>

        {/* CHAT */}
        <TabsContent value="doubt">
          <div className="mt-6 border rounded-2xl p-5 h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={`p-3 rounded-xl ${
                      msg.role === "USER"
                        ? "bg-blue-600 text-white ml-auto w-fit"
                        : "bg-slate-100"
                    }`}
                  >
                    {msg.role === "ASSISTANT" ? (
                      <ReactMarkdown
                        components={
                          markdownComponents
                        }
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming */}
              {isStreaming && (
                <div className="bg-slate-100 p-3 rounded-xl">
                  <ReactMarkdown
                    components={markdownComponents}
                  >
                    {streamingText}
                  </ReactMarkdown>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="mt-4 flex gap-3">
              <textarea
                value={chatInput}
                onChange={(e) =>
                  setChatInput(e.target.value)
                }
                placeholder="Ask your doubt..."
                className="flex-1 border rounded-xl p-3"
              />

              <Button
                onClick={sendChatMessage}
                disabled={chatLoading}
              >
                {chatLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <SendHorizontal className="w-4 h-4" />
                )}
              </Button>
            </div>

            {chatError && (
              <p className="text-red-500 text-sm mt-2">
                {chatError}
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* CURRICULUM */}
      <div className="mt-10">
        <Accordion
          type="multiple"
          defaultValue={["item-0"]}
        >
          {courseData?.modules?.map(
            (section: any, idx: number) => (
              <AccordionItem
                key={section.id}
                value={`item-${idx}`}
              >
                <AccordionTrigger>
                  {section.title}
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-2">
                    {section.videos.map((video: any) => (
                      <div
                        key={video.id}
                        onClick={() => {
                          setActiveLesson(video);

                          router.replace(
                            `?videoId=${video.id}`,
                            {
                              scroll: false,
                            }
                          );

                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className={`p-3 rounded-xl cursor-pointer border ${
                          activeLesson?.id ===
                          video.id
                            ? "bg-blue-50 border-blue-300"
                            : ""
                        }`}
                      >
                        {video.title}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          )}
        </Accordion>
      </div>
    </div>
  );
}