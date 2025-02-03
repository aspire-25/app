"use client"
import { User } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Page() {
    return (
        <div className="fixed top-0 left-0 right-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
        {/* You can replace this with your logo */}
        <div className="rounded-full bg-primary/10 p-2">
    <div className="h-6 w-6 rounded-full bg-primary" />
        </div>
        <span className="text-xl font-semibold font-sans">Spire Hawaii</span>
    </Link>
    <div className="ml-auto flex items-center space-x-4">
    <Avatar>
        <AvatarImage src="/placeholder.svg" alt="User" />
    <AvatarFallback>
        <User className="h-4 w-4" />
        </AvatarFallback>
        </Avatar>
        </div>
        </div>
        </div>
)
}

