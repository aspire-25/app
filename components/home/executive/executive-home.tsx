/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, {useState, useEffect} from "react";
import Image from "next/image";
import {CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import { CalculatedFinancialReportCollection } from "@/lib/fetch";
import { flattenFinancialReportCollection } from "@/lib/financials";

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

  const optionsMap: Record<string, string[]> = {
    "Income Statement": ["Net Sales", "Cost of Goods Sold", "Gross margin %", "Total Operating Expenses", "Operating Expenses %",
      "Profit (Loss) from Operations %", "Total Other Income (Expense) %", "Income (Loss) Before Income Taxes", "Pre-Tax Income %",
      "Net Income (Loss)", "Net Income (Loss) %"],
    "Balance Sheet": ["Total Current Assets", "Total Long-Term Asset", "Total Assets", "Total Current Liabilities", "Total Long-Term Liabilities",
      "Total Liabilities", "Total Stockholder's Equity", "Total Liabilities and Equity"]
  };

  // State for chart data
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  
  // State for financial data
  const [incomeStatements, setIncomeStatements] = useState<Record<string, Record<string, any>>>({});
  const [balanceSheets, setBalanceSheets] = useState<Record<string, Record<string, any>>>({});
  const [years, setYears] = useState<string[]>([]);

  // Fetch financial data from the API - using the same approach as the visualizer component
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        console.log("Fetching financial data...");
        
        // Use the same approach as the visualizer component
        const response = await fetch('/api/financials', {
          method: 'GET',
          cache: 'no-store'
        });
        const financials = await response.json();
        const data = financials.data;
        
        console.log("API Response:", data);
        
        if (data) {
          // Sort years numerically
          const sortedYears = Object.keys(data).map(Number).sort((a, b) => a - b);
          setYears(sortedYears.map(String));
          
          const allBalanceSheets: Record<string, Record<string, any>> = {};
          const allIncomeStatements: Record<string, Record<string, any>> = {};
          
          // Process data for each year
          sortedYears.forEach(year => {
            const balanceData = data[year]?.balance || {};
            const incomeData = data[year]?.income || {};
            
            // Convert null values to 0
            allBalanceSheets[year] = Object.fromEntries(
              Object.entries(balanceData).map(([key, value]) => [key, value ?? 0])
            );
            
            allIncomeStatements[year] = Object.fromEntries(
              Object.entries(incomeData).map(([key, value]) => [key, value ?? 0])
            );
          });
          
          setBalanceSheets(allBalanceSheets);
          setIncomeStatements(allIncomeStatements);
          
          console.log("Income Statements:", allIncomeStatements);
          console.log("Balance Sheets:", allBalanceSheets);
          
          // Create sample data structure for debugging
          const sampleData = [
            {
              year: "2022",
              netSales: 131345,
              costOfGoodsSold: 49123,
              grossProfit: 82222,
              grossMargin: "62.60%",
              totalOperatingExpenses: 52664,
              operatingExpenses: "40.10%",
              profitFromOperations: 29558,
              profitFromOperationsMargin: "22.50%",
              totalOtherIncome: 0,
              totalOtherIncomeMargin: "0.00%",
              incomeBeforeTax: 29558,
              incomeBeforeTaxMargin: "22.50%",
              netIncome: 29558,
              netIncomeMargin: "22.50%",
              totalCurrentAssets: 150000,
              totalLongTermAssets: 250000,
              totalAssets: 400000,
              totalCurrentLiabilities: 80000,
              totalLongTermLiabilities: 120000,
              totalLiabilities: 200000,
              totalStockholdersEquity: 200000,
              totalLiabilitiesAndEquity: 400000
            }
          ];
          
          console.log("Sample data structure for reference:", sampleData[0]);
          
          // Create flattened data from income statements and balance sheets
          const flattenedData = sortedYears.map(year => {
            const incomeData = allIncomeStatements[year] || {};
            const balanceData = allBalanceSheets[year] || {};
            
            return {
              year: year.toString(),
              // Income Statement fields
              netSales: incomeData.revenue || 0,
              costOfGoodsSold: (incomeData.contractingCost || 0) + (incomeData.overhead || 0),
              grossProfit: (incomeData.revenue || 0) - ((incomeData.contractingCost || 0) + (incomeData.overhead || 0)),
              grossMargin: ((incomeData.revenue || 0) > 0) ? 
                (((incomeData.revenue || 0) - ((incomeData.contractingCost || 0) + (incomeData.overhead || 0))) / (incomeData.revenue || 0) * 100).toFixed(2) + "%" : "0%",
              totalOperatingExpenses: (incomeData.salary || 0) + (incomeData.rent || 0) + (incomeData.depreciation || 0) + (incomeData.operatingInterest || 0),
              operatingExpenses: ((incomeData.revenue || 0) > 0) ? 
                (((incomeData.salary || 0) + (incomeData.rent || 0) + (incomeData.depreciation || 0) + (incomeData.operatingInterest || 0)) / (incomeData.revenue || 0) * 100).toFixed(2) + "%" : "0%",
              profitFromOperations: ((incomeData.revenue || 0) - ((incomeData.contractingCost || 0) + (incomeData.overhead || 0))) - 
                ((incomeData.salary || 0) + (incomeData.rent || 0) + (incomeData.depreciation || 0) + (incomeData.operatingInterest || 0)),
              profitFromOperationsMargin: ((incomeData.revenue || 0) > 0) ? 
                ((((incomeData.revenue || 0) - ((incomeData.contractingCost || 0) + (incomeData.overhead || 0))) - 
                ((incomeData.salary || 0) + (incomeData.rent || 0) + (incomeData.depreciation || 0) + (incomeData.operatingInterest || 0))) / (incomeData.revenue || 0) * 100).toFixed(2) + "%" : "0%",
              totalOtherIncome: (incomeData.interestIncome || 0) - (incomeData.interestExpense || 0) + (incomeData.assetGain || 0) + (incomeData.otherIncome || 0),
              totalOtherIncomeMargin: ((incomeData.revenue || 0) > 0) ? 
                (((incomeData.interestIncome || 0) - (incomeData.interestExpense || 0) + (incomeData.assetGain || 0) + (incomeData.otherIncome || 0)) / (incomeData.revenue || 0) * 100).toFixed(2) + "%" : "0%",
              incomeBeforeTax: ((incomeData.revenue || 0) - ((incomeData.contractingCost || 0) + (incomeData.overhead || 0))) - 
                ((incomeData.salary || 0) + (incomeData.rent || 0) + (incomeData.depreciation || 0) + (incomeData.operatingInterest || 0)) + 
                ((incomeData.interestIncome || 0) - (incomeData.interestExpense || 0) + (incomeData.assetGain || 0) + (incomeData.otherIncome || 0)),
              incomeBeforeTaxMargin: ((incomeData.revenue || 0) > 0) ? 
                ((((incomeData.revenue || 0) - ((incomeData.contractingCost || 0) + (incomeData.overhead || 0))) - 
                ((incomeData.salary || 0) + (incomeData.rent || 0) + (incomeData.depreciation || 0) + (incomeData.operatingInterest || 0)) + 
                ((incomeData.interestIncome || 0) - (incomeData.interestExpense || 0) + (incomeData.assetGain || 0) + (incomeData.otherIncome || 0))) / (incomeData.revenue || 0) * 100).toFixed(2) + "%" : "0%",
              netIncome: ((incomeData.revenue || 0) - ((incomeData.contractingCost || 0) + (incomeData.overhead || 0))) - 
                ((incomeData.salary || 0) + (incomeData.rent || 0) + (incomeData.depreciation || 0) + (incomeData.operatingInterest || 0)) + 
                ((incomeData.interestIncome || 0) - (incomeData.interestExpense || 0) + (incomeData.assetGain || 0) + (incomeData.otherIncome || 0)) - 
                (incomeData.incomeTax || 0),
              netIncomeMargin: ((incomeData.revenue || 0) > 0) ? 
                ((((incomeData.revenue || 0) - ((incomeData.contractingCost || 0) + (incomeData.overhead || 0))) - 
                ((incomeData.salary || 0) + (incomeData.rent || 0) + (incomeData.depreciation || 0) + (incomeData.operatingInterest || 0)) + 
                ((incomeData.interestIncome || 0) - (incomeData.interestExpense || 0) + (incomeData.assetGain || 0) + (incomeData.otherIncome || 0)) - 
                (incomeData.incomeTax || 0)) / (incomeData.revenue || 0) * 100).toFixed(2) + "%" : "0%",
              
              // Balance Sheet fields
              totalCurrentAssets: (balanceData.cash || 0) + (balanceData.accountReceivable || 0) + (balanceData.inventory || 0),
              totalLongTermAssets: (balanceData.longTermProperty || 0) + (balanceData.longTermAsset || 0),
              totalAssets: (balanceData.cash || 0) + (balanceData.accountReceivable || 0) + (balanceData.inventory || 0) + 
                (balanceData.longTermProperty || 0) + (balanceData.longTermAsset || 0),
              totalCurrentLiabilities: (balanceData.accountPayable || 0) + (balanceData.currentDebtService || 0) + (balanceData.taxPayable || 0),
              totalLongTermLiabilities: (balanceData.longTermDebtService || 0) + (balanceData.loanPayable || 0),
              totalLiabilities: (balanceData.accountPayable || 0) + (balanceData.currentDebtService || 0) + (balanceData.taxPayable || 0) + 
                (balanceData.longTermDebtService || 0) + (balanceData.loanPayable || 0),
              totalStockholdersEquity: (balanceData.equityCapital || 0) + (balanceData.retainedEarning || 0),
              totalLiabilitiesAndEquity: (balanceData.accountPayable || 0) + (balanceData.currentDebtService || 0) + (balanceData.taxPayable || 0) + 
                (balanceData.longTermDebtService || 0) + (balanceData.loanPayable || 0) + 
                (balanceData.equityCapital || 0) + (balanceData.retainedEarning || 0)
            };
          });
        
          console.log("Flattened Data:", flattenedData);
          
          // Process data for each metric in optionsMap
          const processedChartData: Record<string, any[]> = {};
          
          // Process Income Statement metrics with null/undefined checks
          processedChartData["Net Sales"] = flattenedData.map((item: any) => {
          const value = item.netSales !== undefined ? item.netSales : 0;
          console.log(`Net Sales for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Cost of Goods Sold"] = flattenedData.map((item: any) => {
          const value = item.costOfGoodsSold !== undefined ? item.costOfGoodsSold : 0;
          console.log(`Cost of Goods Sold for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Gross margin %"] = flattenedData.map((item: any) => {
          const value = item.grossMargin !== undefined ? item.grossMargin : 0;
          console.log(`Gross margin % for ${item.year}:`, value);
          return {
            year: item.year,
            value: typeof value === 'string' ? 
              parseFloat(value.replace('%', '')) : 
              (parseFloat(value) || 0)
          };
        });
        
          processedChartData["Total Operating Expenses"] = flattenedData.map((item: any) => {
          const value = item.totalOperatingExpenses !== undefined ? item.totalOperatingExpenses : 0;
          console.log(`Total Operating Expenses for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Operating Expenses %"] = flattenedData.map((item: any) => {
          const value = item.operatingExpenses !== undefined ? item.operatingExpenses : 0;
          console.log(`Operating Expenses % for ${item.year}:`, value);
          return {
            year: item.year,
            value: typeof value === 'string' ? 
              parseFloat(value.replace('%', '')) : 
              (parseFloat(value) || 0)
          };
        });
        
          processedChartData["Profit (Loss) from Operations %"] = flattenedData.map((item: any) => {
          const value = item.profitFromOperationsMargin !== undefined ? item.profitFromOperationsMargin : 0;
          console.log(`Profit from Operations % for ${item.year}:`, value);
          return {
            year: item.year,
            value: typeof value === 'string' ? 
              parseFloat(value.replace('%', '')) : 
              (parseFloat(value) || 0)
          };
        });
        
          processedChartData["Total Other Income (Expense) %"] = flattenedData.map((item: any) => {
          const value = item.totalOtherIncomeMargin !== undefined ? item.totalOtherIncomeMargin : 0;
          console.log(`Total Other Income % for ${item.year}:`, value);
          return {
            year: item.year,
            value: typeof value === 'string' ? 
              parseFloat(value.replace('%', '')) : 
              (parseFloat(value) || 0)
          };
        });
        
          processedChartData["Income (Loss) Before Income Taxes"] = flattenedData.map((item: any) => {
          const value = item.incomeBeforeTax !== undefined ? item.incomeBeforeTax : 0;
          console.log(`Income Before Taxes for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Pre-Tax Income %"] = flattenedData.map((item: any) => {
          const value = item.incomeBeforeTaxMargin !== undefined ? item.incomeBeforeTaxMargin : 0;
          console.log(`Pre-Tax Income % for ${item.year}:`, value);
          return {
            year: item.year,
            value: typeof value === 'string' ? 
              parseFloat(value.replace('%', '')) : 
              (parseFloat(value) || 0)
          };
        });
        
          processedChartData["Net Income (Loss)"] = flattenedData.map((item: any) => {
          const value = item.netIncome !== undefined ? item.netIncome : 0;
          console.log(`Net Income for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Net Income (Loss) %"] = flattenedData.map((item: any) => {
          const value = item.netIncomeMargin !== undefined ? item.netIncomeMargin : 0;
          console.log(`Net Income % for ${item.year}:`, value);
          return {
            year: item.year,
            value: typeof value === 'string' ? 
              parseFloat(value.replace('%', '')) : 
              (parseFloat(value) || 0)
          };
        });
        
          // Process Balance Sheet metrics with null/undefined checks
          processedChartData["Total Current Assets"] = flattenedData.map((item: any) => {
          const value = item.totalCurrentAssets !== undefined ? item.totalCurrentAssets : 0;
          console.log(`Total Current Assets for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Total Long-Term Asset"] = flattenedData.map((item: any) => {
          const value = item.totalLongTermAssets !== undefined ? item.totalLongTermAssets : 0;
          console.log(`Total Long-Term Assets for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Total Assets"] = flattenedData.map((item: any) => {
          const value = item.totalAssets !== undefined ? item.totalAssets : 0;
          console.log(`Total Assets for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Total Current Liabilities"] = flattenedData.map((item: any) => {
          const value = item.totalCurrentLiabilities !== undefined ? item.totalCurrentLiabilities : 0;
          console.log(`Total Current Liabilities for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Total Long-Term Liabilities"] = flattenedData.map((item: any) => {
          const value = item.totalLongTermLiabilities !== undefined ? item.totalLongTermLiabilities : 0;
          console.log(`Total Long-Term Liabilities for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Total Liabilities"] = flattenedData.map((item: any) => {
          const value = item.totalLiabilities !== undefined ? item.totalLiabilities : 0;
          console.log(`Total Liabilities for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Total Stockholder's Equity"] = flattenedData.map((item: any) => {
          const value = item.totalStockholdersEquity !== undefined ? item.totalStockholdersEquity : 0;
          console.log(`Total Stockholder's Equity for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          processedChartData["Total Liabilities and Equity"] = flattenedData.map((item: any) => {
          const value = item.totalLiabilitiesAndEquity !== undefined ? item.totalLiabilitiesAndEquity : 0;
          console.log(`Total Liabilities and Equity for ${item.year}:`, value);
          return {
            year: item.year,
            value: parseFloat(value) || 0
          };
        });
        
          console.log("Processed Chart Data:", processedChartData);
          
          // Add stress test data (using sample data for now)
          processedChartData["Stress Tests"] = [
          { year: "2025", goodsSoldCost: 900, grossProfit: 846 },
          { year: "2026", goodsSoldCost: 1892, grossProfit: 1666 },
          { year: "2027", goodsSoldCost: 2982, grossProfit: 2395 },
          { year: "2028", goodsSoldCost: 4180, grossProfit: 2959 },
          { year: "2029", goodsSoldCost: 5491, grossProfit: 3266 },
          { year: "2030", goodsSoldCost: 6926, grossProfit: 3221 }
        ];
        
          setChartData(processedChartData);
        }
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };
    
    fetchFinancialData();
  }, []);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Check if this is a stress test chart
      if (payload[0].payload.goodsSoldCost !== undefined) {
        const { goodsSoldCost, grossProfit } = payload[0].payload;
        return (
          <div className="custom-tooltip p-2 bg-white border border-gray-300 rounded shadow-lg">
            <p><strong>Year: </strong>{label}</p>
            <p><strong>Principal: </strong>${goodsSoldCost?.toLocaleString()}</p>
            <p><strong>Stress Effect: </strong>${grossProfit?.toLocaleString()}</p>
          </div>
        );
      } else {
        // Regular financial data tooltip
        const dataValue = payload[0].value;
        const dataName = payload[0].name || '';
        
        return (
          <div className="custom-tooltip p-2 bg-white border border-gray-300 rounded shadow-lg">
            <p><strong>Year: </strong>{label}</p>
            <p><strong>Value: </strong>{typeof dataValue === 'number' ? 
              dataName.includes('%') ? 
                `${dataValue.toFixed(2)}%` : 
                `$${dataValue.toLocaleString()}` 
              : dataValue}
            </p>
          </div>
        );
      }
    }
    return null;
  };

  // Toggle function
  const toggleSwitch = (index: number) => {
    setToggles((prev: boolean[]) => {
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
                        data={chartData["Stress Tests"] || []} // Use real data if available
                        margin={{ top: 20, right: 20, bottom: 30, left: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tickMargin={10}>
                          <Label value="Year" offset={-30} position="insideBottom" />
                        </XAxis>
                        <YAxis
                          tickMargin={10}
                          // Dynamically set the domain to range from the rounded lower tick to the rounded upper tick
                          domain={['auto', (dataMax: number) => {
                            // Step 1: Round the dataMax to the nearest 500 or 1000 (or your preferred value)
                            // Round up to the next multiple of 500
                            return Math.ceil(dataMax / 500) * 500;
                          }]}
                          tickFormatter={(tick) => {
                            // Step 2: Round the tick value to the nearest 500 for cleaner ticks
                            const roundedTick = Math.round(tick / 500) * 500;

                            // Step 3: Format the tick value with commas
                            return roundedTick.toLocaleString();
                          }}
                        >
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
          /* Sustainability Model section */
          <div className="p-5 border rounded bg-gray-100">
            <div className="space-y-6">
              {/* Render Income Statement Section */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-center">Income Statement</h3>
                {optionsMap["Income Statement"].map((option) => (
                  <div key={option}>
                    <h4 className="text-lg font-semibold">{option}</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData[option] || []} margin={{ top: 20, right: 20, bottom: 30, left: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tickMargin={10}>
                          <Label value="Year" offset={-30} position="insideBottom" />
                        </XAxis>
                        <YAxis tickMargin={10} domain={['auto', (dataMax: number) => Math.ceil(dataMax / 500) * 500]}>
                          <Label value="Value (in $)" offset={100} position="insideRight" angle={-90} />
                        </YAxis>
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>

              {/* Render Balance Sheet Section */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-center">Balance Sheet</h3>
                {optionsMap["Balance Sheet"].map((option) => (
                  <div key={option}>
                    <h4 className="text-lg font-semibold">{option}</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData[option] || []} margin={{ top: 20, right: 20, bottom: 30, left: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tickMargin={10}>
                          <Label value="Year" offset={-30} position="insideBottom" />
                        </XAxis>
                        <YAxis tickMargin={10} domain={['auto', (dataMax: number) => Math.ceil(dataMax / 500) * 500]}>
                          <Label value="Value (in $)" offset={100} position="insideRight" angle={-90} />
                        </YAxis>
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveHome;
