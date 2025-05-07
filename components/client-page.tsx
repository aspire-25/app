'use client';

import AuditorHome from "./home/auditor/auditor-home";
import AnalystHome from "./home/analyst/analyst-home";
import ExecutiveHome from "./home/executive/executive-home";
import UsersPage from "./home/admin/admin-home";

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
