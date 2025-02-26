'use client';

import React, { useState } from "react";
import {useRouter} from "next/navigation";

const Overview: React.FC = () => {
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");

  const router = useRouter();
  const handleBack = () => {
    router.push('/components/executive');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 mt-[-200px]">
      <h1 className="text-3xl font-bold mb-2">Overview</h1>
      <div className="text-lg text-center mb-6">
        <p>(Will be able to view high-level trends over the years).</p>
        {/* Back button */}
        <div>
          <button className="px-4 py-2 border rounded bg-white hover:bg-blue-200" onClick={handleBack}>Back</button>
        </div>
        {/*Dropdown menus*/}
        <div className="flex space-x-4 items-center justify-center">
          <h3>From</h3>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={selectedOption1}
            onChange={(e) => setSelectedOption1(e.target.value)}
          >
            <option value="">Select</option>
            <option value="select1">Income Statement</option>
            <option value="select2">Assets</option>
            <option value="select3">Liabilities and Equity</option>
            <option value="select4">Stress Test Results</option>
          </select>
          <h3>Select</h3>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={selectedOption2}
            onChange={(e) => setSelectedOption2(e.target.value)}
          >
            <option value="">Select</option>
            <option value="select5">Net Sales</option>
            <option value="select6">Cost of goods sold</option>
            <option value="select7">Gross margin %</option>
            <option value="select8">Option 1</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Overview;