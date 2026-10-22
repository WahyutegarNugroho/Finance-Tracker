"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (!user) {
    return (
      <div className="bg-[#08110A] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#39E75F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#08110A] text-[#08110A] dark:text-[#F5EFE6] font-sans min-h-screen antialiased flex flex-col selection:bg-[#39E75F] selection:text-[#08110A]">
      <Topbar />
      <Sidebar activePath={pathname} />
      <main className="pt-[80px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen w-full">
        <div className="max-w-[1440px] mx-auto w-full h-full">
          {children}
        </div>
      </main>
      <BottomNav activePath={pathname} />
    </div>
  );
}
