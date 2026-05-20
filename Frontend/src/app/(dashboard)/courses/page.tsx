"use client";

import { Search , Plus} from "lucide-react";
import { Card } from "@/components/Card/card";
import { Button } from "@/components/ui/button";
import { CreateCourseModal } from "@/components/Create_Course/create_course";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getAllCourses } from "@/serverAction/allCourses";


type contentProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  students: number;
  rating: number;
  lessons: number;
  progress?: number;
  isPublished: boolean;
  purchases: any[];
  paid: boolean;
  thumbnail: string;
  category: string;
  teacher: {
      name: string;
  };
}


export default function CoursesPage() {
  // Toggle this role for testing: "teacher" | "student"
  const [role, setRole] = useState<"TEACHER" | "STUDENT">("STUDENT");
  const [isOpen, setIsOpen] = useState(false);

  const [content, setContent] = useState<contentProps[]>([]);

  const fetchData = async () => {
    try{
      const data = await getAllCourses();
      setContent(data.data); 
      setRole(data.user.role); 
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect( () => {
    fetchData();
  },[])

 

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {role === "TEACHER" ? "Manage Courses" : "Explore Courses"}
          </h1>
          <p className="text-slate-500 mt-1">
            {role === "TEACHER" ? "Create, edit, and manage your course catalogue." : "Find and enroll in your favorite courses."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Temporary button to toggle roles for demonstration */}
          {/* <Button 
            variant="outline" 
            onClick={() => setRole(role === "teacher" ? "student" : "teacher")}
            className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 font-medium"
          >
            Viewing as: {role === "teacher" ? "Teacher" : "Student"}
          </Button> */}

          {role === "TEACHER" && (
            <Button onClick={()=>setIsOpen(true) }
            className="gap-2 bg-[#0039a6] text-white hover:bg-[#002d84] font-bold shadow-md transition-colors px-6">
             
              <Plus className="w-5 h-5 font-bold" />
              Add Course
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
           {[...content]
            .sort((a, b) => Number(b.paid) - Number(a.paid))
            .map((course) => (
              <Card key={course.id} course={course} role={role} isPurchased={course.paid} />
            ))}
</div>
      {isOpen && ( <CreateCourseModal open={isOpen} onClose={()=>setIsOpen(false)} /> )}
    </div>
  );
}
