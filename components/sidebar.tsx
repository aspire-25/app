import * as React from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import AppSidebarContent from "./sidebar-content"
import { auth } from "@/auth";
import { House } from "lucide-react";
import AppSidebarFooter from "./sidebar-footer";


const AppSidebar = async () => {
    const session = await auth();
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/user">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <House className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold text-l">Home</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <AppSidebarContent role={session?.user?.role || null} />
                {/**<NavProjects projects={data.projects} />*/}
            </SidebarContent>
            <SidebarFooter>
                <AppSidebarFooter session={session} />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar;
