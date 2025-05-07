'use client';

import AuditorHome from "../../components/home/auditor/auditor-home-adjusted";
import AnalystHome from "../../components/home/analyst/analyst-home";
import ExecutiveHome from "../../components/home/executive/executive-home";
import UsersPage from "../../components/home/admin/admin-home";

const Page = ({ tempRole }: { tempRole: string }) => {
    return (
        <div className="pt-[80px]"> 
            {tempRole === "auditor" && <AuditorHome />}
            {tempRole === "analyst" && <AnalystHome />}
            {tempRole === "executive" && <ExecutiveHome />}
            {tempRole === "admin" && <UsersPage />}
        </div>
    );
};


export default Page;
