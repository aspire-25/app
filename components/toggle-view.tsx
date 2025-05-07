'use client';

import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";

const ToggleView = ({ updateTempRole, tempRole }: { updateTempRole: (role: string) => void, tempRole: string }) => {
  
  const handleRoleSwitch = (role: string) => {
    updateTempRole(role);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 focus:outline-none">
            <div className="text-left text-sm hidden md:block pl-2">
                <strong className="font-bold">Toggle View:</strong> {tempRole.charAt(0).toUpperCase() + tempRole.slice(1)}
            </div>

          <ChevronsUpDown className="ml-2 size-4 hidden md:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel><strong className="font-bold">Select View</strong></DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Dropdown items for role switching */}
        <DropdownMenuItem onClick={() => handleRoleSwitch("auditor")} className="hover:bg-blue-100">Auditor View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleSwitch("analyst")} className="hover:bg-blue-100">Analyst View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleSwitch("executive")} className="hover:bg-blue-100">Executive View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleSwitch("admin")} className="hover:bg-blue-100">Administrator View</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleView;
