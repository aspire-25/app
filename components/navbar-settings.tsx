'use client';

import React from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import ToggleView from "@/components/toggle-view"; // Import ToggleView

const NavbarSettings = ({ session, tempRole, updateTempRole }: { session: Session | null, tempRole: string, updateTempRole: (role: string) => void }) => {
    if (!session?.user?.name || !session?.user?.role || !session?.user?.image) {
      return null;
    }
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 focus:outline-none">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={session.user.image} alt={session.user.name} />
              <AvatarFallback className="rounded-lg">{session.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left text-sm hidden md:block">
              <div className="font-medium">{session.user.name}</div>
              <div className="text-xs opacity-75">Viewing as: {tempRole.charAt(0).toUpperCase() + tempRole.slice(1)}</div>
            </div>
            <ChevronsUpDown className="ml-2 size-4 hidden md:block" />
          </button>
        </DropdownMenuTrigger>
  
        <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg p-2">
          <DropdownMenuLabel><strong className="font-bold">Settings</strong></DropdownMenuLabel>
          <DropdownMenuSeparator />
  
          <ToggleView tempRole={tempRole} updateTempRole={updateTempRole} />
  
          <DropdownMenuSeparator />
  
          <DropdownMenuItem asChild>
            <a href="/user/manage-user" className="hover:bg-gray-100 p-2 block">Manage User</a>
          </DropdownMenuItem>
<DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 hover:bg-red-100">
            <LogOut size={16} />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  export default NavbarSettings;
  