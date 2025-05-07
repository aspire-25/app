"use client";

import React, { useEffect, useState } from "react";
import { getSession, Session } from "next-auth/react";
import NavbarSettings from "@/components/navbar-settings";
import Page from "@/app/user/page";

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [tempRole, setTempRole] = useState("auditor"); // Track global role

  useEffect(() => {
    getSession().then((sess) => setSession(sess));
  }, []);

  return (
    <>
      <nav className="bg-blue-500/50 backdrop-blur-md p-6 text-white flex items-center justify-between fixed w-full top-0 left-0 z-50">
        <div className="flex items-center">
          <img src="/spire-logo.svg" alt="Spire Logo" className="h-12 mr-4" />
          <div className="text-xl font-semibold">Welcome, {tempRole.charAt(0).toUpperCase() + tempRole.slice(1)}</div>
        </div>
        <NavbarSettings session={session} tempRole={tempRole} updateTempRole={setTempRole} />
      </nav>

      <Page tempRole={tempRole} />
    </>
  );
};

export default Navbar;
