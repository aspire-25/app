'use client';

import React, { useState } from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

const ExecutiveHome: React.FC = () => {
  const [activeYear, setActiveYear] = useState<number>(2025);
  const years = [2025, 2026, 2027, 2028];
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleToggleExpand = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const router = useRouter();
  const handleOverview = () => {
    console.log('Redirecting to overview');
    router.push('/user/overview');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center bg-blue-400 p-4 rounded">
        <Image src="/spirelogo.png" alt="Spire Logo" width={120} height={40} className="object-contain" />
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500">JD</div>
          <div>
            <h2 className="text-xl font-bold text-black">John Doe</h2>
            <p className="text-sm text-gray-700">Executive</p>
          </div>
        </div>
      </header>

      <div className="flex gap-2 mt-4 items-center">
        {/* Year buttons */}
        <div className="flex gap-2 flex-grow">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-4 py-2 border rounded 
                ${activeYear === year ? "bg-gray-300" : "bg-white"} 
                ${activeYear !== year ? "hover:bg-blue-200" : ""}`}>
              {year}
            </button>
          ))}
        </div>

        {/* Overview Page button */}
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded bg-white hover:bg-blue-200" onClick={handleOverview}>Overview</button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {[
          "Stress Test Results", //summary results from S1-S5
          "Sustainability Model"
        ].map((title) => (
          <div
            key={title}
            className={`bg-gray-200 p-4 rounded shadow-sm flex flex-col justify-start transition-all duration-300 ease-in-out ${
              expandedSection === title ? "h-auto" : "h-16"
            }`}
          >
            <div className="flex justify-between w-full">
              <h3 className="text-2xl font-bold">{title}</h3>
              <button
                onClick={() => handleToggleExpand(title)}
                className="px-4 py-2 bg-white border rounded hover:bg-blue-200"
              >
                View
              </button>
            </div>
            {/* Expanded content */}
            {expandedSection === title && (
              <div className="mt-2 p-4 bg-white border rounded shadow-md">
                <p>Graphs will go here</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveHome;