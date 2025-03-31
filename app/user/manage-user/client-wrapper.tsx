"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppUser, toggleUserActive, updateRole } from "@/lib/fetch";
import { useEffect, useState } from "react";

const ClientWrapper = ({ user }: { user: AppUser }) => {

    const [role, setRole] = useState<string>(user.role);

    useEffect(() => {
        updateRole(user.id, role);
    }, [role]);

    return (
        <div className="flex items-center gap-4 w-full">
            <Button onClick={() => toggleUserActive(user.id, !user.active)}>
                {user.active ? 'Disable' : 'Enable'}
            </Button>
            <Select value={role} onValueChange={(value) => setRole(value)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="auditor">Auditor</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export default ClientWrapper;