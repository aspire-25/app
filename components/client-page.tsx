'use client';

// import { auth } from "@/auth";
import AuditorHome from "./home/auditor/auditor-home";
import AnalystHome from "./home/analyst/analyst-home";
import ExecutiveHome from "./home/executive/executive-home";
import UsersPage from "./home/admin/admin-home";
import { Button } from "./ui/button";
import { useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";

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
        <div className="pt-0 mt-0">
            {/* Sticky Header with logo and user info */}
            <header className="bg-spire-header p-4 flex flex-col items-center sticky top-0 z-50 shadow mt-0 pt-0">
                <div className="w-full flex justify-between items-center max-w-5xl mx-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <img src="/spirelogo.png" alt="Spire Logo" className="h-10 w-auto" />
                    </div>
                    {/* User Info */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500">JD</div>
                        <div className="text-white">
                            <div>John Doe</div>
                            <div className="text-sm opacity-80">{tempRole.charAt(0).toUpperCase() + tempRole.slice(1)}</div>
                        </div>
                    </div>
                </div>
                {/* View switch buttons below logo/user info */}
                <div className="flex justify-center w-full mt-4">
                    <div className="flex bg-white rounded-full shadow px-2 py-2 gap-2">
                        <Button
                            onClick={() => updateTempRole('analyst')}
                            className={`font-bold rounded-full px-8 py-3 text-lg transition-colors ${tempRole === 'analyst' ? 'bg-[#F04E23] text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                        >
                            Analyst View
                        </Button>
                        <Button
                            onClick={() => updateTempRole('executive')}
                            className={`font-bold rounded-full px-8 py-3 text-lg transition-colors ${tempRole === 'executive' ? 'bg-[#F04E23] text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                        >
                            Executive View
                        </Button>
                        <Button
                            onClick={() => updateTempRole('auditor')}
                            className={`font-bold rounded-full px-8 py-3 text-lg transition-colors ${tempRole === 'auditor' ? 'bg-[#F04E23] text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                        >
                            Auditor View
                        </Button>
                        <Button
                            onClick={() => updateTempRole('admin')}
                            className={`font-bold rounded-full px-8 py-3 text-lg transition-colors ${tempRole === 'admin' ? 'bg-[#F04E23] text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                        >
                            Admin View
                        </Button>
                    </div>
                </div>
            </header>
            <PageContent />
        </div>
    );
}

export default Page;
