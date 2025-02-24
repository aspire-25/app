"use client"

import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";

const getInitials = (name: string): string => {
    const WORDS = name.trim().split(/\s+/);
    if (WORDS.length === 1) {
        return WORDS[0].slice(0, 2).toUpperCase();
    }
    if (WORDS.length === 2) {
        return (WORDS[0][0] + WORDS[1][0]).toUpperCase();
    }
    return (WORDS[0][0] + WORDS[WORDS.length - 1][0]).toUpperCase();
};

const getRolename = (role: string): string => {
    switch (role) {
        case 'auditor':
            return 'Auditor';
        case 'analyst':
            return 'Analyst';
        case 'executive':
            return 'Executive';
        case 'admin':
            return 'Administrator';
        default:
            return role;
    }
}

const AppSidebarFooter = ({ session }: { session: Session | null }) => {

    const { isMobile } = useSidebar();
    const { setTheme } = useTheme();

    if (!session?.user?.image || !session?.user?.name || !session?.user?.email || !session?.user?.role) {
        return <></>;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={session.user.image} alt={session.user.name} />
                                <AvatarFallback className="rounded-lg">{getInitials(session.user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{session.user.name}</span>
                                <span className="truncate text-xs">Viewing as: {getRolename(session.user.role)}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={session.user.image} alt={session.user.name} />
                                    <AvatarFallback className="rounded-lg">{getInitials(session.user.name)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{session.user.name}</span>
                                    <span className="truncate text-xs">{session.user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <span>Toggle theme</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={() => signOut({ redirectTo: '/' })}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default AppSidebarFooter;
