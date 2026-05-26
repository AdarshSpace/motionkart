
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { getCourse, getChatHistory, sendChat } from '@/serverAction/learn';

import {
  Play, CheckCircle, Download, FileText, MessageSquare,
  Bookmark, Share2, SendHorizontal, Sparkles, Bot, User, BookOpen, Loader2, AlertCircle, Navigation, NavigationIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import MuxPlayer from "@mux/mux-player-react";


export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [courseData, setCourseData] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // ── AI Chat State ──
  interface ChatMessage {
    role: "USER" | "ASSISTANT";
    text: string;
    sources?: {
      courseId: string;
      moduleId: string;
      moduleTitle?: string;
      videoId: string;
      videoTitle?: string;
      fileName: string;
      chunkIndex: number;
    }[];
  }
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Typewriter animation state ──
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const pendingSourcesRef = useRef<any[]>([]);

  // ── Typewriter animation ──
  function animateResponse(text: string) {
    setIsStreaming(true);
    setStreamingText("");
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
          { role: "ASSISTANT", text, sources: pendingSourcesRef.current },
        ]);
        setStreamingText("");
        pendingSourcesRef.current = [];
      }
    }, 12);
  }

  // ── Fetch chat history when active lesson changes ──
  useEffect(() => {
    if (!activeLesson?.id || !courseId) return;

    const fetchChatHistory = async () => {
      try {
        const data = await getChatHistory(courseId as string, activeLesson.id);
        if (data.success) {
          setChatMessages(data.messages ?? []);
        } else {
          setChatMessages([]);
        }
      } catch (err) {
        console.log("Failed to load chat history", err);
        setChatMessages([]);
      }
    };

    fetchChatHistory();
  }, [activeLesson?.id]);

  // ── Send chat message ──
  async function sendChatMessage() {
    const question = chatInput.trim();
    if (!question || chatLoading) return;

    const videoId = activeLesson?.id;
    if (!videoId) return;

    setChatInput("");
    setChatError(null);
    setChatMessages((prev) => [...prev, { role: "USER", text: question }]);
    setChatLoading(true);

    try {
      console.log("Question from learn page : ", question);
      const data = await sendChat(courseId as string, videoId, question);
      console.log("Data from learn page : ", data);
      if (!data.success) {
        throw new Error(data.message || "Failed to get AI response");
      }

      pendingSourcesRef.current = data.sources || [];
      animateResponse(data.answer);

    } catch (err: any) {
      setChatError(err.message || "Something went wrong");
    } finally {
      setChatLoading(false);
    }
  }

  // ── Auto-scroll chat ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading, streamingText]);



  // ── Fetch course & auto-select video from URL query param ──
  async function fetchCourse(courseId: string) {
    try {
      const { data } = await getCourse(courseId);

      setCourseData(data);
    } catch (error) {
      console.log('Error : ', error);
    }
  }

  useEffect(() => {
    fetchCourse(courseId as string);
  }, [courseId]);

  useEffect(() => {
    if (courseData?.modules?.length > 0) {
      const videoIdFromUrl = searchParams.get("videoId");
      let targetVideo = null;

      if (videoIdFromUrl) {
        for (const module of courseData.modules) {
          const found = module.videos?.find((v: any) => v.id === videoIdFromUrl);
          if (found) {
            targetVideo = found;
            break;
          }
        }
      }

      if (targetVideo) {
        if (targetVideo.id !== activeLesson?.id) {
          setActiveLesson(targetVideo);
        }
      } else if (!activeLesson) {
        setActiveLesson(courseData.modules[0]?.videos?.[0]);
      }
    }
  }, [courseData, searchParams]);



  // ── Share: copy URL with videoId query param ──
  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}?videoId=${activeLesson?.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }


  // ── Shared ReactMarkdown components ──
  const markdownComponents = {
    p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
    strong: ({ children }: any) => <strong className="font-bold text-slate-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    ul: ({ children }: any) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
    li: ({ children }: any) => <li className="text-slate-700">{children}</li>,
    code: ({ children }: any) => (
      <code className="bg-slate-100 text-[#0039a6] px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-slate-100 rounded-xl p-3 overflow-x-auto text-xs font-mono mb-2">{children}</pre>
    ),
    h1: ({ children }: any) => <h1 className="font-bold text-base mb-1">{children}</h1>,
    h2: ({ children }: any) => <h2 className="font-bold text-sm mb-1">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-semibold text-sm mb-1">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-[#0039a6]/30 pl-3 italic text-slate-500 mb-2">{children}</blockquote>
    ),
    hr: () => <hr className="border-slate-200 my-2" />,
  };

  // ── Check saved state when lesson changes ──
  useEffect(() => {
    if (!activeLesson?.id) return;
    const checkSaved = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/saveVideo/saved/${activeLesson.id}/check`,
          { credentials: "include" }
        );
        const data = await res.json();
        setIsSaved(data.isSaved ?? false);
      } catch {
        setIsSaved(false);
      }
    };
    checkSaved();
  }, [activeLesson?.id]);

  // ── Save / Unsave video ──
  async function handleSave() {
    if (!activeLesson?.id || !courseId || saveLoading) return;
    setSaveLoading(true);
    try {
      if (isSaved) {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/saveVideo/saved/${activeLesson.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setIsSaved(false);
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/saveVideo/save`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId: activeLesson.id, courseId }),
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaveLoading(false);
    }
  }
  console.log("ActiveLesson : ", activeLesson)

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-white animate-in fade-in duration-500 pb-20 p-2 rounded-3xl">

      {/* ── Main Content Area ── */}
      <div className="flex-1 min-w-0">

        {/* Video Player */}
        <div className="w-full bg-black relative group shadow-2xl rounded-2xl overflow-hidden mb-10">
          <div className="aspect-video relative w-full h-full">
             <MuxPlayer playbackId={activeLesson?.muxPlaybackId} thumbnailTime={21} streamType="on-demand" className="w-full h-full"
              style={{
                '--media-primary-color': '#FFFFFF',      // timeline / progress bar
                '--media-accent-color': '#3b82f6',        // hover / accent
              } }/>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto w-full">

          {/* Title + Actions */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10 pb-1">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight leading-[1.1]">
                {activeLesson?.title}
              </h1>
              <p className="text-slate-400 font-medium">Course: {courseData?.title}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0 pt-2">
              <Button
                onClick={handleSave}
                disabled={saveLoading}
                variant="outline"
                size="lg"
                className={`gap-2 border-slate-200 h-11 px-5 font-bold transition-all rounded-xl ${isSaved
                  ? "bg-blue-50 border-[#0039a6]/30 text-[#0039a6] hover:bg-blue-100"
                  : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {saveLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#0039a6]" : ""}`} />
                )}
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="lg"
                className="gap-2 border-slate-200 h-11 px-5 font-bold text-slate-700 hover:bg-slate-50 transition-all rounded-xl"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="w-full flex flex-col items-start overflow-visible">
            <TabsList className="bg-slate-100 p-1 rounded-2xl flex mb-12 w-full lg:w-fit border-none justify-start overflow-x-auto no-scrollbar shrink-0 z-20 relative">
              <TabsTrigger
                value="description"
                className="rounded-xl px-10 py-3.5 text-sm font-bold tracking-tight data-active:bg-white data-active:shadow-xl data-active:text-slate-900 text-slate-500 transition-all cursor-pointer flex-1 lg:flex-none"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="rounded-xl px-10 py-3.5 text-sm font-bold tracking-tight data-active:bg-white data-active:shadow-xl data-active:text-slate-900 text-slate-500 transition-all cursor-pointer flex-1 lg:flex-none"
              >
                Resources
              </TabsTrigger>
              <TabsTrigger
                value="doubt"
                className="rounded-xl px-10 py-3.5 text-sm font-bold tracking-tight data-active:bg-white data-active:shadow-xl data-active:text-slate-900 text-slate-500 transition-all cursor-pointer flex-1 lg:flex-none"
              >
                <Sparkles className="w-4 h-4 mr-2 inline-block" />
                Ask Doubt
              </TabsTrigger>
            </TabsList>

            <div className="w-full relative z-10">

              {/* Description Tab */}
              <TabsContent value="description" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700 outline-none">
                <div className="flex flex-col bg-slate-50 border border-gray-300 rounded-2xl overflow-hidden p-8 space-y-8">

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-slate-900 text-base mb-3">About this Lesson</h4>
                    <p className="text-slate-600 leading-relaxed text-sm font-medium">
                      {activeLesson?.description || "No description available for this lesson."}
                    </p>
                  </div>

                  {/* Key Topics */}
                  {activeLesson?.topics && activeLesson.topics.length > 0 && (
                    <>
                      <hr className="border-slate-200" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base mb-5">Key Topics</h4>
                        <ul className="space-y-3">
                          {activeLesson.topics.map((topic: string, i: number) => (
                            <li key={i} className="flex items-center gap-3 text-slate-600 font-medium group cursor-default">
                              <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 group-hover:scale-150 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                </div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-50 pb-12">
                  {activeLesson?.notesUrl ? (
                    <div className="flex items-center justify-between p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-[#0039a6]">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-800 mb-0.5">Lecture Notes</p>
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">PDF Document</p>
                        </div>
                      </div>

                      <a
                        href={activeLesson.notesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#0039a6] hover:bg-[#002d85] text-white text-sm font-semibold rounded-lg transition-colors duration-150"
                      >
                        <NavigationIcon className="w-4 h-4" />
                        Open
                      </a>
                    </div>
                  ) : (
                    <div className="col-span-full p-12 bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem] text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold">No resources available for this lesson.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ── AI Doubt Assistant Tab ── */}
              <TabsContent value="doubt" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700 outline-none">
                <div className="flex flex-col bg-slate-50 border border-gray-300 rounded-2xl overflow-hidden" style={{ height: '730px' }}>

                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#0039a6] flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-none mb-0.5">AI Doubt Assistant - Powered by RAG</h4>
                        <p className="text-slate-400 text-xs font-medium">Ask any question related to this course.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-emerald-700 font-semibold">Online</span>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scroll-smooth">

                    {/* Empty state */}
                    {chatMessages.length === 0 && !chatLoading && !isStreaming && (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                          <Bot className="w-7 h-7 text-[#0039a6]" />
                        </div>
                        <h5 className="font-semibold text-slate-800 text-base mb-1.5">Ask your doubts.</h5>
                        <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
                          Feel free to ask any doubt related to this course.
                          <br />
                          <span className="text-slate-500">I can't help with questions that are not related to this course.</span>
                        </p>
                      </div>
                    )}

                    {/* Committed messages */}
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-2.5 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'ASSISTANT' && (
                          <div className="w-8 h-8 rounded-full bg-[#0039a6] flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[75%] flex flex-col gap-1.5 ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`px-4 py-3 text-sm leading-relaxed font-medium ${msg.role === 'USER'
                              ? 'bg-[#0039a6] text-white rounded-2xl rounded-br-sm'
                              : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-sm '
                              }`}
                          >
                            {msg.role === 'USER' ? (
                              msg.text
                            ) : (
                              <ReactMarkdown components={markdownComponents}>
                                {msg.text}
                              </ReactMarkdown>
                            )}
                          </div>

                          {/* Sources */}
                          {msg.role === 'ASSISTANT' && msg.sources && msg.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-0.5">
                              {msg.sources.map((src, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-semibold text-amber-700"
                                >
                                  <BookOpen className="w-3 h-3 shrink-0" />
                                  <span>{src.fileName || src.videoTitle || 'Source'}</span>
                                  {src.chunkIndex !== undefined && (
                                    <span className="text-amber-400 font-medium">· chunk {src.chunkIndex + 1}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {msg.role === 'USER' && (
                          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Typewriter streaming bubble */}
                    {isStreaming && (
                      <div className="flex gap-2.5 justify-start">
                        <div className="w-8 h-8 rounded-full bg-[#0039a6] flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="max-w-[75%] px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-sm shadow-sm text-sm leading-relaxed font-medium">
                          <ReactMarkdown components={markdownComponents}>
                            {streamingText}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* Typing dots — only while waiting for API, not while streaming */}
                    {chatLoading && !isStreaming && (
                      <div className="flex gap-2.5 justify-start">
                        <div className="w-8 h-8 rounded-full bg-[#0039a6] flex items-center justify-center shrink-0">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-bl-sm">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {chatError && (
                      <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold w-fit">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {chatError}
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="px-5 py-4 border-t border-slate-200 bg-white shrink-0">
                    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 focus-within:border-[#0039a6]/50 focus-within:bg-white rounded-xl px-4 py-3 transition-all duration-200">
                      <textarea
                        rows={1}
                        value={chatInput}
                        onChange={(e) => {
                          setChatInput(e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendChatMessage();
                          }
                        }}
                        placeholder="Ask a doubt about this lesson…"
                        className="flex-1 bg-transparent resize-none outline-none text-slate-700 text-sm font-medium placeholder:text-slate-400 leading-relaxed overflow-hidden"
                        style={{ height: '20px' }}
                        disabled={chatLoading || isStreaming}
                      />
                      <button
                        onClick={sendChatMessage}
                        disabled={chatLoading || isStreaming || !chatInput.trim()}
                        className="w-9 h-9 rounded-xl bg-[#0039a6] hover:bg-[#002d85] disabled:bg-slate-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-150 active:scale-95 shrink-0"
                      >
                        {chatLoading
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <SendHorizontal className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium text-center mt-2">
                      Answers are grounded in course notes · Shift+Enter for a new line
                    </p>
                  </div>

                </div>
              </TabsContent>

            </div>
          </Tabs>
        </div>
      </div>

      {/* ── Curriculum Sidebar ── */}
      <div className="w-full lg:w-[370px] bg-white border border-slate-200 rounded-xl overflow-hidden h-fit">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 text-base">Course Content</h3>
            <span className="text-xs font-medium text-slate-500">25%</span>
          </div>
          <div className="bg-slate-100 h-1.5 w-full rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: '25%' }} />
          </div>
        </div>

        <div className="pb-0">
          <Accordion type="multiple" defaultValue={["item-0"]} className="w-full">
            {courseData?.modules?.map((section: any, idx: number) => (
              <AccordionItem
                key={section.id}
                value={`item-${idx}`}
                className="border-b border-slate-200 last:border-none"
              >
                <AccordionTrigger className="px-5 py-4 hover:bg-slate-50 hover:no-underline transition-colors">
                  <div className="flex flex-col gap-0.5 w-full text-left">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      Section {idx + 1}
                    </span>
                    <span className="font-medium text-slate-900 text-sm">{section.title}</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="p-0 border-t border-slate-200">
                  <div className="flex flex-col bg-white/50">
                    {section.videos.map((video: any) => (
                      <div
                        key={video.id}
                        onClick={() => {
                          setActiveLesson(video);
                          setIsPlaying(false);
                          // update URL with videoId query param — no page reload
                          router.replace(`?videoId=${video.id}`, { scroll: false });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`flex items-start gap-3 px-5 py-3 cursor-pointer transition-colors border-b border-slate-100 last:border-none ${activeLesson?.id === video.id ? "bg-blue-50/40" : "hover:bg-slate-50"
                          }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${activeLesson?.id === video.id ? "border-blue-600" : "border-slate-300"
                              }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium leading-snug mb-1 ${activeLesson?.id === video.id ? "text-blue-700" : "text-slate-700"
                              }`}
                          >
                            {video.title}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Play className="w-3 h-3" />
                            <span>{video.duration || "5 min"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

    </div>
  );
}