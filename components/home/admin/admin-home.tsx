"use client"

import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

function UserCard({ user }: { user: User }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
      <Avatar className="h-10 w-10">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium">{user.name}</span>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">{user.role}</span>
          <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge>
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const [search, setSearch] = useState("")

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#7B96EC] p-4 flex justify-between items-center">
        <Image src="/spirelogo.png" alt="Spire Logo" width={120} height={40} className="object-contain" priority />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <div>John Doe</div>
              <div className="text-sm opacity-80">Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6">
        <div className="max-w-md mx-auto mb-8">
          <Input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </main>

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

