"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreateCourseModal } from "@/components/Create_Course/create_course";

export default function AddCourseButton() {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-[#0039a6] text-white hover:bg-[#002d84] font-bold shadow-md transition-colors px-6"
      >
        <Plus className="w-5 h-5 font-bold" />
        Add Course
      </Button>

      {isOpen && (
        <CreateCourseModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}