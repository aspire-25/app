'use client';

import React, { useState } from "react";
import Image from "next/image";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label} from "recharts";

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

  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");

  const optionsMap: Record<string, string[]> = {
    "Income Statement": ["Net Sales", "Cost of Goods Sold", "Gross margin %", "Total operating expenses", "Operating expenses %",
      "Profit (loss) from operations %", "Total other income (expense) %", "Income (loss) before income taxes", "Pre-tax income %",
      "Net income (loss)", "Net income (loss) %"],
    "Balance Sheet": ["Total Current Assets", "Total long-term asset", "Total Assets", "Total Current Liabilities", "Total Long-term Liabilities",
      "Total Liabilities", "Total Stockholder's Equity", "Total Liabilities and Equity"]
  };

  // Example data for different chart selections
  const sampleData: Record<string, { year: string; value?: number; goodsSoldCost?: number; grossProfit?: number }[]> = {
    "Net Sales": [
      { year: "2025", value: 153034 },
      { year: "2026", value: 155329 },
      { year: "2027", value: 157659 },
      { year: "2028", value: 160024 },
      { year: "2029", value: 162424 },
      { year: "2030", value: 164861 }
    ],
    "Cost of Goods Sold": [
      { year: "2025", goodsSoldCost: 53000, grossProfit: 99500 },
      { year: "2026", goodsSoldCost: 54000, grossProfit: 100500 },
      { year: "2027", goodsSoldCost: 55000, grossProfit: 102613 },
      { year: "2028", goodsSoldCost: 56000, grossProfit: 105485 },
      { year: "2029", goodsSoldCost: 57000, grossProfit: 107755 },
      { year: "2030", goodsSoldCost: 58000, grossProfit: 108372 }
    ],
    "Total Current Assets": [
      { year: "2025", value: 200 },
      { year: "2026", value: 250 },
      { year: "2027", value: 300 }
    ],
    "Stress Tests": [ //placeholder
      { year: "2025", goodsSoldCost: 900, grossProfit: 846 },
      { year: "2026", goodsSoldCost: 1892, grossProfit: 1666 },
      { year: "2027", goodsSoldCost: 2982, grossProfit: 2395 },
      { year: "2028", goodsSoldCost: 4180, grossProfit: 2959 },
      { year: "2029", goodsSoldCost: 5491, grossProfit: 3266 },
      { year: "2030", goodsSoldCost: 6926, grossProfit: 3221 }
    ]
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: never) => {
    if (active && payload && payload.length) {
      const { goodsSoldCost, grossProfit } = payload[0].payload; // Get the data from the hovered point

      // Calculate the difference
      const difference = grossProfit - goodsSoldCost;

      return (
        <div className="custom-tooltip p-2 bg-white border border-gray-300 rounded shadow-lg">
          <p><strong>Year: </strong>{label}</p>
          <p><strong>Principal: </strong>${goodsSoldCost}</p>
          <p><strong>Stress Effect: </strong>${grossProfit}</p>
          <p><strong>Interest Lost: </strong>${difference}</p>
        </div>
      );
    }
    return null;
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
                    {/* <p className="text-gray-600">📊 Graph Placeholder for Stress Test #{index + 1}</p> */}
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={sampleData["Stress Tests"]} // Replace with actual data for the stress test
                        margin={{ top: 20, right: 20, bottom: 30, left: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tickMargin={10}>
                          <Label value="Year" offset={-30} position="insideBottom" />
                        </XAxis>
                        <YAxis tickMargin={10}>
                          <Label value="Value (in $)" offset={100} position="insideRight" angle={-90} />
                        </YAxis>
                        <Tooltip content={<CustomTooltip />} />
                        {/* Render multiple lines for different stress test scenarios */}
                        <Line type="monotone" dataKey="goodsSoldCost" stroke="#8884d8" strokeWidth={2} name="Principal"/>
                        <Line type="monotone" dataKey="grossProfit" stroke="#82ca9d" strokeWidth={2} name="Stress Effect"/>
                        {/* Add more lines later */}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /*Sustainability Model section*/
          <div className="p-5 border rounded bg-gray-100">
            <div className="flex space-x-4 items-center justify-center">
              <h3>From</h3>
              <select
                className="p-2 border border-gray-300 rounded md"
                value={selectedOption1}
                onChange={(e) => {
                  setSelectedOption1(e.target.value);
                  setSelectedOption2(""); // Reset second dropdown when first changes
                }}
              >
                <option value="">Select</option>
                {Object.keys(optionsMap).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              <h3>View</h3>
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={selectedOption2}
                onChange={(e) => setSelectedOption2(e.target.value)}
                disabled={!selectedOption1}
              >
                <option value="">Select</option>
                {selectedOption1 && optionsMap[selectedOption1].map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              {selectedOption2 && sampleData[selectedOption2] ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sampleData[selectedOption2]} margin={{ top: 20, right: 20, bottom: 30, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tickMargin={10}>
                      <Label value="Year" offset={-30} position="insideBottom" />
                    </XAxis>
                    <YAxis tickMargin={10}>
                      <Label value="Value (in $)" offset={100} position="insideRight" angle={-90}/>
                    </YAxis>
                    <Tooltip />
                    {/* Render different lines depending on selectedOption2 */}
                    {selectedOption2 === "Cost of Goods Sold" ? (
                      <>
                        <Line type="monotone" dataKey="goodsSoldCost" stroke="#8884d8" strokeWidth={2} name="Cost of Goods Sold" />
                        <Line type="monotone" dataKey="grossProfit" stroke="#82ca9d" strokeWidth={2} name="Gross Profit" />
                      </>
                    ) : (
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p> Select an option to view the graph</p>
              /*<p>📊 Select an option to view the graph</p>*/
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default ExecutiveHome;