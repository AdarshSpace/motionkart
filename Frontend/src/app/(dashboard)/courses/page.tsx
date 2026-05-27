export const dynamic = "force-dynamic";
import { Card } from "@/components/Card/card";
import { getAllCourses } from "@/serverAction/allCourses";
import AddCourseButton from "../../../components/Create_Course/AddCourseButton";


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


export default async function CoursesPage() {

  const data = await getAllCourses();

  const content: contentProps[] = data.data 
  const role = data.user.role;

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

          {role === "TEACHER" && (
            <AddCourseButton />
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
     
    </div>
  );
}
