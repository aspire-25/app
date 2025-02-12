'use client';

// import { auth } from "@/auth";
import AuditorHome from "./home/auditor/auditor-home";
import AnalystHome from "./home/analyst/analyst-home";
import ExecutiveHome from "./home/executive/executive-home";
import UsersPage from "./home/admin/admin-home";
import { Button } from "./ui/button";
import { useState } from "react";

const Page = () => {
    // ^^^ got rid of the async for now.
    // const session = await auth();

    const DefaultContent = () => {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
        );
    }

    const [tempRole, updateTempRole] = useState("auditor")

    const PageContent = () => {
        /*
        if (session?.user.role === 'admin') {
            return <AuditorHome />
        } else if (session?.user.role === 'analyst') {
            return <AnalystHome />
        }
        else if(session?.user.role === 'executive') {
          return <ExecutiveHome />
        } 
        else if (session?user.role === 'admin') {
            return <UsersPage />
        }
            */
        // return <DefaultContent />

        if (tempRole === 'auditor') {
            return <AuditorHome />
        } else if (tempRole === 'analyst') {
            return <AnalystHome />
        }
        else if(tempRole === 'executive') {
          return <ExecutiveHome />
        } 
        else if (tempRole === 'admin') {
            return <UsersPage />
        } else {
            return <DefaultContent />
        }
    };

    return (
        <>
            <Button onClick={() => updateTempRole("analyst")}>Analyst View</Button>
            <Button onClick={() => updateTempRole("executive")}>Executive View</Button>
            <Button onClick={() => updateTempRole("auditor")}>Auditor View</Button>
            <Button onClick={() => updateTempRole("admin")}>Admin View</Button>
            <p className="text-2xl">Currently Viewing: {tempRole} view</p>
            <PageContent />
        </>
        
    );
}

export default Page;
