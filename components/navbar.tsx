"use client";

import React, { useEffect, useState } from "react";
import { getSession, Session } from "next-auth/react";
import NavbarSettings from "@/components/navbar-settings";
import Page from "@/components/client-page"; // Import Page component

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [tempRole, setTempRole] = useState("auditor"); // Now `tempRole` is shared globally

  useEffect(() => {
    getSession().then((sess) => setSession(sess));
  }, []);

  return (
    <>
      <nav className="bg-blue-500/50 backdrop-blur-md p-4 text-white flex items-center justify-between fixed w-full top-0 left-0 z-50">
        <div className="flex items-center">
          <img src="/spire-logo.svg" alt="Spire Logo" className="h-10 mr-4" />
          <div className="text-xl font-semibold">Hi</div>
        </div>
        {/* Pass tempRole to NavbarSettings */}
        <NavbarSettings session={session} tempRole={tempRole} updateTempRole={setTempRole} />
      </nav>

      {/* Pass tempRole to client-page.tsx */}
      <Page tempRole={tempRole} />
    </>
  );
};

export default Navbar;
