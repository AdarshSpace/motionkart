export const dynamic = "force-dynamic";
import { getCourse } from "@/serverAction/learn";

import { ArrowLeft, Play, CheckCircle2, Users, Star, Globe, ShieldCheck, HelpCircle, Video, FileText, MessageCircle, Lock } from "lucide-react";
import Link from 'next/link';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BuyButton from "@/components/BuyButton/BuyButton";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function CourseDetailPage({ params }: { params:{ courseId: string }}) {

  const { courseId } = await params;

  const { data: details } = await getCourse(courseId);

  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg font-semibold">
        Course not found
      </div>
    );
  }

  const totalLessons = details.modules?.reduce(
      (acc: number, module: any) =>
        acc + (module.videos?.length || 0),
      0
    ) || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Navigation */}
        <Link
          href="/courses"
          className="inline-flex items-center text-slate-500 hover:text-[#0039a6] font-bold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          BACK TO ALL COURSES
        </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-blue-50 text-[#0039a6] border-none px-3 py-1 font-bold">
                {details.category || "COURSE"}
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-200 text-slate-500 font-medium"
              >
                Bestseller
              </Badge>

              <div className="flex items-center gap-1.5 ml-auto text-[#0039a6] font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                Verified Course
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              {details.title}
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
              {details.description}
            </p>

            <div className="flex flex-wrap items-center gap-8 py-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </div>

                <span className="font-bold text-slate-800">
                  {details.rating || 4.9}
                </span>

                <span className="text-slate-400 text-sm">
                  (1,248 ratings)
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 font-medium whitespace-nowrap">
                <Users className="w-4 h-4 text-slate-400" />

                {details.students || "2.4k+"} Successful Learners
              </div>

              <div className="flex items-center gap-2 text-slate-600 font-medium whitespace-nowrap">
                <Globe className="w-4 h-4 text-slate-400" />
                English [Auto]
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* About */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">
              About the Course
            </h2>

            <div className="prose prose-slate max-w-none">
              

              <p className="text-slate-600 text-lg leading-relaxed">
                This course is designed to help learners gain practical
                real-world understanding with structured lessons,
                guided modules, and hands-on learning experiences.
              </p>
            </div>
          </div>

          {/* Learnings */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 font-mono text-xs uppercase tracking-widest text-[#0039a6]">
              What you will learn
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                "Build practical understanding",
                "Learn industry-level concepts",
                "Understand real workflows",
                "Hands-on project-based learning",
                "Improve problem-solving skills",
                "Gain confidence with implementation",
              ].map((obj, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />

                  <span className="text-slate-600 leading-snug">
                    {obj}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className="space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Course Curriculum
                </h2>

                <p className="text-slate-400 font-medium mt-1 uppercase tracking-tighter text-xs">
                  {details.modules?.length || 0} Sections •{" "}
                  {totalLessons} Lessons
                </p>
              </div>

             
            </div>

            <Accordion
              type="multiple"
              defaultValue={["item-0"]}
              className="border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm"
            >
              {details.modules?.map(
                (section: any, idx: number) => (
                  <AccordionItem
                    key={section.id}
                    value={`item-${idx}`}
                    className="border-slate-50 last:border-0 px-2"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 group-data-[state=open]:bg-[#0039a6] group-data-[state=open]:text-white group-data-[state=open]:border-none transition-colors">
                          {idx + 1}
                        </div>

                        <span className="font-bold text-slate-700 text-lg group-hover:text-[#0039a6] transition-colors">
                          {section.title}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-6 pb-2">
                      <div className="space-y-1 ml-12">
                        {section.videos?.map(
                          (video: any, uIdx: number) => (
                            <div
                              key={video.id}
                              className="flex items-center justify-between py-3 border-t border-slate-50 group/item hover:bg-slate-50 px-3 rounded-xl transition-colors cursor-default"
                            >
                              <div className="flex items-center gap-3">
                                <Play className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-[#0039a6]" />

                                <span className="text-slate-600 font-medium">
                                  {video.title}
                                </span>
                              </div>

                              <span className="text-xs text-slate-400 font-mono tracking-tighter">
                                <Lock className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-[#0039a6]" />
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </div>

          {/* FAQ */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#0039a6]">
                <HelpCircle className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Accordion type="single" className="w-full space-y-4">
                {[
                  {
                    q: "Can I access this course on mobile?",
                    a: "Yes, the platform is fully responsive and works across all devices.",
                  },
                  {
                    q: "Will I get lifetime access?",
                    a: "Yes, once enrolled you can access the course anytime.",
                  },
                  {
                    q: "Will I get support?",
                    a: "Yes, doubt support is available throughout the course.",
                  },
                ].map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border border-slate-100 rounded-2xl px-6 bg-white overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-bold text-slate-700 hover:text-[#0039a6] hover:no-underline py-5">
                      {faq.q}
                    </AccordionTrigger>

                    <AccordionContent className="text-slate-500 leading-relaxed pb-6 text-lg">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="border-slate-200 shadow-xl overflow-hidden rounded-xl py-0">
              <div className="aspect-video relative group cursor-pointer bg-slate-900">
                <img
                  src={details.thumbnail}
                  alt="Course Preview"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="text-slate-800 fill-current w-6 h-6 ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-white font-bold text-sm drop-shadow-md">
                    Preview this course
                  </span>
                </div>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">
                      ₹{details.price}
                    </span>

                    <span className="text-slate-500 line-through text-lg">
                      ₹{details.oldPrice}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                   
                <BuyButton courseId={courseId} />

                 
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                    This course includes:
                  </h4>

                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <Video className="w-4 h-4 text-slate-400" />
                      Video on demand
                    </li>

                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <MessageCircle className="w-4 h-4 text-slate-400" />
                      24/7 doubt support
                    </li>

                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      2 years warranty
                    </li>

                    <li className="flex items-center gap-3 text-sm text-slate-600">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Certificate of completion
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}