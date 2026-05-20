"use client";

import { Header } from "../../components/Layouts/Header";
import { Sidebar } from "../../components/Layouts/Side-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col pl-16 transition-all duration-300">
        <Header />
        <main className="mx-auto w-full max-w-[1600px] flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
