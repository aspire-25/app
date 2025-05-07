'use client';

import AuditorHome from "./home/auditor/auditor-home";
import AnalystHome from "./home/analyst/analyst-home";
import ExecutiveHome from "./home/executive/executive-home";
import UsersPage from "./home/admin/admin-home";

const Page = ({ tempRole }: { tempRole: string }) => {
    const PageContent = () => {
        if (tempRole === "auditor") return <AuditorHome />;
        if (tempRole === "analyst") return <AnalystHome />;
        if (tempRole === "executive") return <ExecutiveHome />;
        if (tempRole === "admin") return <UsersPage />;
        return <div className="text-center p-4">Please select a view.</div>;
    };

    return <PageContent />;
};

export default Page;
