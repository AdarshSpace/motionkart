import { HeroSection, DescriptionSection, CourseContent, RightSidebar } from "../../../components/dashboard/DashboardContent";

export default function HomePage() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-1">
          <HeroSection />
          <DescriptionSection />
          <CourseContent />
        </div>

        <div className="lg:col-span-4">
          <RightSidebar />
        </div>
      </div>
    </>
  );
}