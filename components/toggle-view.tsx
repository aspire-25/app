'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";

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

const ToggleView = () => {
  const router = useRouter();
  const [tempRole, setTempRole] = useState("auditor");

  // Handle role switching
  const handleRoleSwitch = (role: string) => {
    setTempRole(role); // Update the view state
    router.push(`/home/${role}`); // Navigate to the corresponding page
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 focus:outline-none">
          <div className="text-left text-sm hidden md:block">
            <div className="font-medium">Viewing as: {getRolename(tempRole)}</div>
          </div>
          <ChevronsUpDown className="ml-2 size-4 hidden md:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel>Toggle View</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Dropdown items for switching views */}
        <DropdownMenuItem onClick={() => handleRoleSwitch("auditor")} className="hover:bg-blue-100">Auditor View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleSwitch("analyst")} className="hover:bg-blue-100">Analyst View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleSwitch("executive")} className="hover:bg-blue-100">Executive View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleSwitch("admin")} className="hover:bg-blue-100">Administrator View</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleView;
