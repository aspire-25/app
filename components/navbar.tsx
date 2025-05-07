"use client";

import React, { useEffect, useState } from "react";
import { getSession, Session } from "next-auth/react";
import NavbarSettings from "@/components/navbar-settings";
import ViewSwitcher from "@/components/toggle-view"; 

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    getSession().then((sess) => setSession(sess));
  }, []);

  return (
    <nav className="bg-blue-500/50 backdrop-blur-md p-4 text-white flex items-center justify-between fixed w-full top-0 left-0 z-50">
      <div className="flex items-center">
        <img src="/spire-logo.svg" alt="Spire Logo" className="h-10 mr-4" />
        <div className="text-xl font-semibold">Hi</div>
      </div>
      <NavbarSettings session={session} />
    </nav>
  );
};

export default Navbar;
