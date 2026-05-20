
import { Play, Star, Users, Edit2 } from "lucide-react";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Course {
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

interface CardProps {
    course: Course;
    role: string;
    isPurchased: boolean;
}


export  function Card({ course, role, isPurchased }: CardProps) {
    return (
        <div
              key={course.id} 
              className="overflow-hidden max-w-sm border-2 border-slate-200 rounded-xl hover:shadow-md transition-shadow group flex flex-col gap-1 h-full p-0"
            >
              <div className="aspect-video relative overflow-hidden shrink-0 bg-slate-100">
                 <img 
                   src={course.thumbnail} 
                   alt={course.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute top-3 left-3 flex gap-2">
                   {((role === "STUDENT" && !isPurchased) || role === "TEACHER") && (
                     <Badge className="bg-white/90 text-slate-800 hover:bg-white border-none backdrop-blur-sm shadow-sm">
                       {course.category}
                     </Badge>
                   )}
                   {role === "TEACHER" && (
                     <Badge className={`border-none backdrop-blur-sm shadow-sm ${course.isPublished ? 'bg-green-500/90 hover:bg-green-500 text-white' : 'bg-slate-600/90 hover:bg-slate-600 text-white'}`}>
                       {course.isPublished ? 'Published' : 'Draft'}
                     </Badge>
                   )}
                 </div>
              </div>
              
              <CardHeader className="px-5 py-0">
                <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{course.title}</h3>
                
                {/* {role === "STUDENT" && isPurchased && (
                   <p className="text-sm text-slate-500 mt-0 text-right">by {course.teacher.name}</p>
                )} */}
              </CardHeader>
              
              <CardContent className="px-5 py-0 space-y-0 flex-grow">
                {((role === "STUDENT") || role === "TEACHER") && (
                  <p className="text-sm text-slate-600 line-clamp-2 min-h-[40px]">
                    {course.description}
                  </p>
                )}

                {/* {role === "STUDENT" && isPurchased && (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>Progress</span>
                      <span>{course.progress || 25}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${course.progress || 25}%` }}
                      ></div>
                    </div>
                  </div>
                )} */}

                <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-50">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-nowrap">
                      <Users className="w-3.5 h-3.5" />
                      {course.students || '2.4k+'} 
                    </div>
                    <div className="flex items-center gap-1 text-nowrap">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      {course.rating || '4.9'} 
                    </div>
                  </div>
                  
                  {((role === "STUDENT" && !isPurchased) || role === "TEACHER") && (
                    <div className="flex items-center gap-1.5">
                      {course.oldPrice && (
                        <span className="line-through text-slate-400">₹{course.oldPrice}</span>
                      )}
                      <span className="font-bold text-lg text-slate-800">₹{course.price}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="px-5 py-5 flex gap-2">
                 {role === "TEACHER" && (
                   <Link href={`/courses/${course.id}/edit`} className="w-full">
                     <Button variant="outline" className="w-full gap-2 border-slate-200 font-bold hover:bg-[#0039a6] hover:text-white hover:border-[#0039a6] transition-colors">
                       <Edit2 className="w-4 h-4" />
                       Edit Course
                     </Button>
                   </Link>
                 )}

                 {role === "STUDENT" && !isPurchased && (
                   <Link href={`/courses/${course.id}`} className="w-full">
                     <Button className="w-full gap-2 bg-[#0039a6] text-white hover:bg-[#002d84] font-bold transition-colors">
                       View Details
                     </Button>
                   </Link>
                 )}

                 {role === "STUDENT" && isPurchased && (
                   <Link href={`/courses/${course.id}/learn`} className="w-full">
                     <Button className="w-full gap-2 bg-green-600 text-white hover:bg-green-700 font-bold transition-colors">
                       <Play className="w-4 h-4 fill-current" />
                       Continue
                     </Button>
                   </Link>
                 )}
              </CardFooter>        
        </div>
    );
}