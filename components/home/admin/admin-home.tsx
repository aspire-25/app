"use client"

import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type UserRole = "executive" | "analyst" | "audit"

interface User {
  id: string
  name: string
  role: UserRole
  isActive: boolean
}

const users: User[] = [
  { id: "1", name: "Sarah Johnson", role: "executive", isActive: true },
  { id: "2", name: "Michael Chen", role: "analyst", isActive: true },
  { id: "3", name: "Emma Davis", role: "audit", isActive: false },
  { id: "4", name: "James Wilson", role: "analyst", isActive: true },
  { id: "5", name: "Maria Garcia", role: "executive", isActive: true },
  { id: "6", name: "David Kim", role: "audit", isActive: true },
  { id: "7", name: "Lisa Brown", role: "analyst", isActive: false },
  { id: "8", name: "Robert Taylor", role: "executive", isActive: true },
]

const stats = {
  active: 250,
  deleted: 5,
}

interface UserCardProps {
  user: User
  onToggleActive: (id: string) => void
  onRoleChange: (id: string, newRole: UserRole) => void
}

function UserCard({ user, onToggleActive, onRoleChange }: UserCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  return (
    <>
      <div 
        className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={() => setIsDialogOpen(true)}
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500">{user.role}</span>
            <Badge variant={user.isActive ? "default" : "secondary"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User: {user.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <button
                className={`px-3 py-1.5 rounded text-sm ${
                  user.isActive 
                    ? "bg-red-100 text-red-700 hover:bg-red-200" 
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
                onClick={() => {
                  onToggleActive(user.id)
                  setIsDialogOpen(false)
                }}
              >
                {user.isActive ? "Deactivate Account" : "Activate Account"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Role:</span>
              <select
                className="px-3 py-1.5 rounded text-sm border"
                value={user.role}
                onChange={(e) => {
                  onRoleChange(user.id, e.target.value as UserRole)
                  setIsDialogOpen(false)
                }}
              >
                <option value="executive">Executive</option>
                <option value="analyst">Analyst</option>
                <option value="audit">Audit</option>
              </select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [userList, setUserList] = useState<User[]>(users)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    role: "analyst" as UserRole,
  })

  const filteredUsers = userList.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleActive = (id: string) => {
    setUserList((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    )
  }

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUserList((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    )
  }

  const handleAddUser = () => {
    if (!newUser.name.trim()) return

    const newUserWithId: User = {
      id: (userList.length + 1).toString(),
      name: newUser.name.trim(),
      role: newUser.role,
      isActive: true,
    }

    setUserList((prev) => [...prev, newUserWithId])
    setNewUser({ name: "", role: "analyst" })
    setIsAddUserDialogOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="max-w-md w-full">
            <Input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={() => setIsAddUserDialogOpen(true)}
            className="bg-[#7B96EC] hover:bg-[#6B86DC]"
          >
            Add New User
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onToggleActive={handleToggleActive}
              onRoleChange={handleRoleChange}
            />
          ))}
        </div>
      </main>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Enter user's full name"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                className="w-full px-3 py-2 rounded-md border"
                value={newUser.role}
                onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
              >
                <option value="executive">Executive</option>
                <option value="analyst">Analyst</option>
                <option value="audit">Audit</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              className="bg-[#7B96EC] hover:bg-[#6B86DC]"
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-100 p-6">
        <div className="container mx-auto space-y-2">
          <p className="text-gray-600">Employees deleted: {stats.deleted}</p>
          <p className="text-gray-600">Employees active: {stats.active}</p>
        </div>
      </footer>
    </div>
  )
}

