'use client';

import React, { useState } from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

// Function to format role display
const getRolename = (role: string): string => {
  switch (role) {
    case "auditor":
      return "Auditor";
    case "analyst":
      return "Analyst";
    case "executive":
      return "Executive";
    case "admin":
      return "Administrator";
    default:
      return role;
  }
};

const NavbarSettings = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  const [tempRole, setTempRole] = useState(session?.user?.role || "auditor");

  if (!session?.user?.name || !session?.user?.role || !session?.user?.image) {
    return null;
  }

  // Handle role switching
  const handleRoleSwitch = (role: string) => {
    setTempRole(role); // Update view state
    router.push(`/home/${role}`); // Navigate to the selected page
  };

  return (
    <nav className="bg-blue-500/50 backdrop-blur-md p-4 text-white flex items-center justify-between fixed w-full top-0 left-0 z-50">
      <div className="flex items-center">
        <img src="/spire-logo.svg" alt="Spire Logo" className="h-10 mr-4" />
        <div className="text-xl font-semibold">Hi, {session.user.name}</div>
      </div>

      <div className="flex items-center ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus:outline-none">
              <div className="text-left text-sm hidden md:block">
                <div className="font-medium">{session.user.name}</div>
                <div className="text-xs opacity-75">Viewing as: {getRolename(tempRole)}</div>
              </div>
              <Avatar className="h-8 w-8 rounded-lg ml-2">
                <AvatarImage src={session.user.image} alt={session.user.name} />
                <AvatarFallback className="rounded-lg">{session.user.name[0]}</AvatarFallback>
              </Avatar>
              <ChevronsUpDown className="ml-2 size-4 hidden md:block" />
            </button>
          </DropdownMenuTrigger>

          {/* Dropdown Content */}
          <DropdownMenuContent align="end" className="w-full mt-2 bg-white shadow-lg p-2">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Toggle View Menu - Vertical Layout */}
            <DropdownMenuItem className="flex flex-col gap-2 p-2">
              <span className="text-sm font-medium">Toggle View</span>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleRoleSwitch("auditor")} className={`w-full py-2 text-left px-3 rounded-md ${tempRole === "auditor" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>Auditor</button>
                <button onClick={() => handleRoleSwitch("analyst")} className={`w-full py-2 text-left px-3 rounded-md ${tempRole === "analyst" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>Analyst</button>
                <button onClick={() => handleRoleSwitch("executive")} className={`w-full py-2 text-left px-3 rounded-md ${tempRole === "executive" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>Executive</button>
                <button onClick={() => handleRoleSwitch("admin")} className={`w-full py-2 text-left px-3 rounded-md ${tempRole === "admin" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>Administrator</button>
              </div>
            </DropdownMenuItem>

            {/* Separate Logout Button */}
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2">
              <LogOut size={16} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavbarSettings;
