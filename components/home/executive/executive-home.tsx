'use client';

import React, { useState } from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

const ExecutiveHome: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("Stress Test Results");
  const sections = ["Stress Test Results", "Sustainability Model"];
  const [toggles, setToggles] = useState<boolean[]>(Array(5).fill(false));
  const stressTestDesc = [
    "Scenario #1: 30% drop in return rate of investment",
    "Scenario #2: 60% sustained drop in returned rate of investment",
    "Scenario #3: One-time \"X\" event of $50,000",
    "Scenario #4: Increase 2.5% operating expenses each year",
    "Scenario #5: Decrease bond return to 1.7% due to increase in inflation"
  ]

  const router = useRouter();
  const handleOverview = () => {
    router.push('/user/overview');
  };

  // Toggle function
  const toggleSwitch = (index: number) => {
    setToggles((prev) => {
      const updatedToggles = [...prev];
      updatedToggles[index] = !updatedToggles[index];
      return updatedToggles;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/*Top Nav bar with logo and user title*/}
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
        {/* Section buttons */}
        <div className="flex gap-2 flex-grow">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 border rounded 
                ${activeSection === section ? "bg-gray-300" : "bg-white"} 
                ${activeSection !== section ? "hover:bg-blue-200" : ""}`}>
              {section}
            </button>
          ))}
        </div>

        {/* Overview Page button */}
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded bg-white hover:bg-blue-200" onClick={handleOverview}>Overview</button>
        </div>
      </div>

      {/* Dynamic Content Based on Active Section */}
      <div className="mt-4 p-4 bg-white rounded shadow-md">
        {activeSection === "Stress Test Results" ? (
          <div className="space-y-4">
            {toggles.map((isOn, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Stress Test #{index + 1}</h3>
                  <div
                    className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300
                      ${isOn ? "bg-green-500" : "bg-gray-300"}`}
                    onClick={() => toggleSwitch(index)}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300
                        ${isOn ? "translate-x-6" : "translate-x-0"}`}
                    ></div>
                  </div>
                </div>
                {/*Stress Test Description*/}
                <p className="mt-2 text-gray-700">{stressTestDesc[index]}</p>

                {/*Graph Placeholder - only shows if toggle is on*/}
                {isOn && (
                  <div className="mt-2 p-4 border rounded bg-gray-100">
                    <p className="text-gray-600">📊 Graph Placeholder for Stress Test #{index + 1}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 border rounded bg-gray-100">
            <p className="text-gray-600">📊 Sustainability Model Graph Placeholder</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default ExecutiveHome;