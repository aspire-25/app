import React from 'react';
import { Avatar } from './ui/avatar';

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export function Header({ userName = 'John Doe', userRole = 'User' }: HeaderProps) {
  return (
    <header className="w-full bg-[#6699ff] py-4 px-6 flex justify-between items-center">
      {/* Logo on the left */}
      <div className="flex items-center">
        <img 
          src="/spirelogo.png" 
          alt="Spire Logo" 
          className="h-10 w-auto"
        />
      </div>
      
      {/* User profile on the right */}
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 bg-white flex items-center justify-center text-gray-500 border-2 border-gray-200">
          <span>pfp</span>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-black">{userName}</span>
          <span className="text-sm text-gray-700">{userRole}</span>
        </div>
      </div>
    </header>
  );
}
