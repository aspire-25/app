'use client';

import AnalystHome from "../../components/home/analyst/analyst-home";
import ExecutiveHome from "../../components/home/executive/executive-home";
import UsersPage from "../../components/home/admin/admin-home";
import { useLayoutEffect, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuditorHomeAdjusted from "@/components/home/auditor/auditor-home-adjusted";

const Page = ({ tempRole }: { tempRole: string }) => {
  const router = useRouter();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (tempRole !== "auditor") {
      router.push("/user");
    }
  }, [tempRole, router]);

  return (
    <div className="pt-[80px]">
      {tempRole === "auditor" && <AuditorHomeAdjusted />}
      {tempRole === "analyst" && <AnalystHome />}
      {tempRole === "executive" && <ExecutiveHome />}
      {tempRole === "admin" && <UsersPage />}
    </div>
  );
};

export default Page;
