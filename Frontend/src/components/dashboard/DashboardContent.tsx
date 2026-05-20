"use client";

import { useState } from "react";
import { Play, Edit, Plus, GripVertical, FileText, ChevronRight, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();
  return (
    <Card className="bg-[#0039a6] text-white overflow-hidden border-none shadow-xl mb-6 relative">
      <CardContent className="p-0 flex h-72">
        <div className="flex-1 p-10 flex flex-col justify-center">
          <p className="text-blue-200 text-sm font-medium mb-2">Motion Design</p>
          <h1 className="text-4xl font-bold mb-4">Magic of Animation!</h1>
          <p className="text-blue-100 max-w-md opacity-80">
            {/* This Blender course covers 3D modeling, lighting, materials, animation, sculpting, and rendering workflows used in games, films, and product visualization.  */}

Start with the basics. Build real projects. Get feedback from pros. Join a community that actually helps.          </p>
        </div>
        
        <div className="w-[450px] relative">
          {/* Abstract circles decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white rounded-full" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center p-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden w-full max-w-sm shadow-2xl">
              <div className="aspect-video relative group">
                {/* <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80" 
                  alt="Compliance" 
                  className="w-full h-full object-cover"
                /> */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Link href="/courses/1" className="w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                     <Play className="text-[#0039a6] fill-current w-6 h-6 ml-1" />
                   </Link>
                </div>
                <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 scale-150">
                    <Link 
                      href="/courses/1"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#0039a6]/20 cursor-pointer relative z-20"
                    >
                      <Play className="text-[#0039a6] fill-current w-4 h-4 ml-0.5" />
                    </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DescriptionSection() {
  return (
    <Card className="bg-white border-slate-200 shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Overview</h2>
          {/* <Button variant="outline" size="sm" className="gap-2 text-slate-600 hover:text-slate-900">
            <Edit className="w-4 h-4" />
            Edit
          </Button> */}
        </div>
        <p className="text-slate-600 leading-relaxed text-sm">
          Learn industry-standard creative workflows across animation, motion graphics, visual design, and digital production. Build real-world projects while mastering tools used by modern creators and studios. Start your creative journey with hands-on projects in animation, motion design, visual storytelling, and digital content creation       </p>
      </CardContent>
    </Card>
  );
}

const projects = [
  {
    id: 1,
    title: "Character Animation",
    subtitle: "Bring stylized characters to life",
    category: "3D Animation",
    categoryColor: "bg-[#7c3aed]",
    time: "01:28",
    image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800&q=80"
  },
  {
    id: 2,
    title: "Motion Graphics Reel",
    subtitle: "Create cinematic motion visuals",
    category: "Motion Graphics",
    categoryColor: "bg-[#c026d3]",
    time: "01:45",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80"
  },
  {
    id: 3,
    title: "Sci-Fi Environment",
    subtitle: "Design immersive 3D worlds",
    category: "3D Environment",
    categoryColor: "bg-[#059669]",
    time: "02:06",
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=800&q=80"
  }
];

export function CourseContent() {
  return (
    <Card className="bg-[#f8f7ff] border-none shadow-sm overflow-hidden mb-6">
      <CardContent className="p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">See what you can create</h2>
            <p className="text-sm text-slate-600">Watch real student projects and see what's possible.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent font-semibold gap-1 rounded-lg"
          >
            View all projects
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {projects.map((project) => (
            <div key={project.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
              {/* Background Image */}
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>

              {/* Top Left Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`${project.categoryColor} hover:${project.categoryColor} border-none text-white px-3 py-1 text-xs font-semibold rounded-full shadow-sm`}>
                  {project.category}
                </Badge>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <Play className="text-slate-900 fill-current w-6 h-6 ml-1" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate">{project.title}</h3>
                  <p className="text-slate-300 text-sm truncate">{project.subtitle}</p>
                </div>
                <div className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                  {project.time}
                </div>
              </div>
            </div>
          ))}

          {/* Right Arrow Navigation */}
          <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border border-slate-100 z-10 hover:scale-105 transition-transform hidden md:flex">
             <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

const learners = [
  { name: "Jessica Diaz", avatar: "https://i.pravatar.cc/150?u=1" },
  { name: "Devon Lane", avatar: "https://i.pravatar.cc/150?u=2" },
  { name: "Courtney Henry", avatar: "https://i.pravatar.cc/150?u=3" },
  { name: "Nancy W. Terry", avatar: "https://i.pravatar.cc/150?u=4" },
  { name: "Arlene McCoy", avatar: "https://i.pravatar.cc/150?u=5" },
  { name: "Susan K. Bien", avatar: "https://i.pravatar.cc/150?u=6" },
  { name: "Ronald Richards", avatar: "https://i.pravatar.cc/150?u=7" },
];

const completionRates = [
  { title: "Company Policies and Culture", rate: 86, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&q=80" },
  { title: "Data Protection and Privacy", rate: 62, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&q=80" },
  { title: "Anti-harassment and Discrimination", rate: 100, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80" },
];

export function RightSidebar() {
  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Tabs defaultValue="learners" className="w-full">
            <div className="border-b px-4">
              <TabsList className="bg-transparent h-12 w-full justify-start gap-4">
                <TabsTrigger value="stats" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#0039a6] rounded-none px-0 text-slate-400">
                  Statistics
                </TabsTrigger>
                <TabsTrigger value="learners" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#0039a6] rounded-none px-0 text-slate-400">
                  Learners
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="learners" className="p-0 m-0">
               <div className="p-4 flex items-center justify-between border-b bg-slate-50/50">
                 <span className="text-sm font-semibold text-slate-700">32 Learners</span>
               </div>
               <div className="divide-y divide-slate-100">
                 {learners.map((learner, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-3">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={learner.avatar} />
                         <AvatarFallback>{learner.name[0]}</AvatarFallback>
                       </Avatar>
                       <span className="text-xs font-medium text-slate-700">{learner.name}</span>
                     </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                        <GripVertical className="w-4 h-4" />
                     </Button>
                   </div>
                 ))}
               </div>
               <div className="p-4 pt-2">
                 <Button variant="secondary" className="w-full bg-[#f1f5f9] text-slate-600 hover:bg-slate-200 shadow-none text-xs h-10">
                   View all
                 </Button>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Courses completion rate</h3>
            <ChevronRight className="w-4 h-4 text-[#0039a6] cursor-pointer" />
          </div>
          
          <div className="space-y-4">
            {completionRates.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-semibold text-slate-700 leading-tight mb-1">{item.title}</p>
                </div>
                <div className="relative w-10 h-10 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90">
                      <circle cx="20" cy="20" r="18" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      <circle 
                        cx="20" cy="20" r="18" fill="none" stroke={item.rate === 100 ? "#22c55e" : "#0039a6"} 
                        strokeWidth="3" 
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={2 * Math.PI * 18 * (1 - item.rate / 100)}
                        strokeLinecap="round"
                      />
                   </svg>
                   <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">
                     {item.rate}%
                   </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


