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
        <div>
            <Button onClick={() => updateTempRole("analyst")} className = "m-1">Analyst View</Button>
            <Button onClick={() => updateTempRole("executive")} className = "m-1">Executive View</Button>
            <Button onClick={() => updateTempRole("auditor")} className = "m-1">Auditor View</Button>
            <Button onClick={() => updateTempRole("admin")} className = "m-1">Admin View</Button>
            <p className="text-base">Currently Viewing: {tempRole} view</p>
            <br></br>
            <PageContent />
        </div>
        
    );
}

export default Page;
