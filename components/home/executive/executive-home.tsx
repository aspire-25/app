/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from "react";
import { CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ExecutiveHome: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("Stress Test Results");
  const sections = ["Stress Test Results", "Sustainability Model"];
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

  const [stressToggles, setStressToggles] = useState<boolean[]>(Array(5).fill(false));
  const [incomeToggles, setIncomeToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(optionsMap["Income Statement"].map(option => [option, false]))
  );
  const [balanceToggles, setBalanceToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(optionsMap["Balance Sheet"].map(option => [option, false]))
  );

  // State for chart data
  const [chartData, setChartData] = useState<Record<string, any[]>>({});

  // State for forecast settings
  const [forecastYears] = useState<number>(5);
  const [forecastTypes] = useState<{ [key: string]: 'average' | 'multiplier' }>({});
  const [multipliers] = useState<{ [key: string]: number }>({});

  // Helper function to calculate percentages
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? (value / total * 100).toFixed(2) + "%" : "0%";
  };

  // Helper function to render chart sections
  const renderChartSection = (title: string, options: string[], toggles: Record<string, boolean>, setToggles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
      {options.map((option) => (
        <div key={option} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold">{option}</h4>
            <div
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300
              ${toggles[option] ? "bg-green-500" : "bg-gray-300"}`}
              onClick={() => {
                setToggles(prev => ({
                  ...prev,
                  [option]: !prev[option]
                }));
              }}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300
                ${toggles[option] ? "translate-x-6" : "translate-x-0"}`}
              ></div>
            </div>
          </div>

          {toggles[option] && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData[option] || []} margin={{ top: 20, right: 20, bottom: 30, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tickMargin={10}>
                  <Label value="Year" offset={-30} position="insideBottom" />
                </XAxis>
                <YAxis
                  tickMargin={10}
                  domain={['auto', (dataMax: number) => Math.ceil(dataMax / 500) * 500]}
                  tickFormatter={(value) => {
                    // Check if the option name includes '%' to determine if it's a percentage value
                    if (option.includes('%')) {
                      return `${value}%`;
                    }
                    return `$${value.toLocaleString()}`;
                  }}
                >
                  <Label
                    value={option.includes('%') ? "% Value" : "Value (in $)"}
                    offset={100}
                    position="insideRight"
                    angle={-90}
                  />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      ))}
    </div>
  );

  // Fetch financial data from API
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Fetch financial data
        const response = await fetch('/api/financials', {
          method: 'GET',
          cache: 'no-store'
        });
        const financials = await response.json();
        const data = financials.data;

        if (data) {
          // Sort years numerically
          const sortedYears = Object.keys(data).map(Number).sort((a, b) => a - b);

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

          // Create flattened data from income statements and balance sheets
          const flattenedData = sortedYears.map(year => {
            const incomeData = allIncomeStatements[year] || {};
            const balanceData = allBalanceSheets[year] || {};

            // Extract common values to reduce duplication
            const revenue = incomeData.revenue || 0;
            const contractingCost = incomeData.contractingCost || 0;
            const overhead = incomeData.overhead || 0;
            const salary = incomeData.salary || 0;
            const rent = incomeData.rent || 0;
            const depreciation = incomeData.depreciation || 0;
            const operatingInterest = incomeData.operatingInterest || 0;
            const interestIncome = incomeData.interestIncome || 0;
            const interestExpense = incomeData.interestExpense || 0;
            const assetGain = incomeData.assetGain || 0;
            const otherIncome = incomeData.otherIncome || 0;
            const incomeTax = incomeData.incomeTax || 0;

            // Calculate derived values
            const cogs = contractingCost + overhead;
            const grossProfit = revenue - cogs;
            const opEx = salary + rent + depreciation + operatingInterest;
            const otherInc = interestIncome - interestExpense + assetGain + otherIncome;
            const profitFromOps = grossProfit - opEx;
            const incomeBeforeTax = profitFromOps + otherInc;
            const netInc = incomeBeforeTax - incomeTax;

            // Extract common balance sheet values
            const cash = balanceData.cash || 0;
            const accountReceivable = balanceData.accountReceivable || 0;
            const inventory = balanceData.inventory || 0;
            const longTermProperty = balanceData.longTermProperty || 0;
            const longTermAsset = balanceData.longTermAsset || 0;
            const accountPayable = balanceData.accountPayable || 0;
            const currentDebtService = balanceData.currentDebtService || 0;
            const taxPayable = balanceData.taxPayable || 0;
            const longTermDebtService = balanceData.longTermDebtService || 0;
            const loanPayable = balanceData.loanPayable || 0;
            const equityCapital = balanceData.equityCapital || 0;
            const retainedEarning = balanceData.retainedEarning || 0;

            // Calculate derived balance sheet values
            const currentAssets = cash + accountReceivable + inventory;
            const longTermAssets = longTermProperty + longTermAsset;
            const totalAssets = currentAssets + longTermAssets;
            const currentLiabilities = accountPayable + currentDebtService + taxPayable;
            const longTermLiabilities = longTermDebtService + loanPayable;
            const totalLiabilities = currentLiabilities + longTermLiabilities;
            const equity = equityCapital + retainedEarning;
            const liabilitiesAndEquity = totalLiabilities + equity;

            return {
              year: year.toString(),
              // Income Statement fields
              netSales: revenue,
              costOfGoodsSold: cogs,
              grossProfit: grossProfit,
              grossMargin: calculatePercentage(grossProfit, revenue),
              totalOperatingExpenses: opEx,
              operatingExpenses: calculatePercentage(opEx, revenue),
              profitFromOperations: profitFromOps,
              profitFromOperationsMargin: calculatePercentage(profitFromOps, revenue),
              totalOtherIncome: otherInc,
              totalOtherIncomeMargin: calculatePercentage(otherInc, revenue),
              incomeBeforeTax: incomeBeforeTax,
              incomeBeforeTaxMargin: calculatePercentage(incomeBeforeTax, revenue),
              netIncome: netInc,
              netIncomeMargin: calculatePercentage(netInc, revenue),

              // Balance Sheet fields
              totalCurrentAssets: currentAssets,
              totalLongTermAssets: longTermAssets,
              totalAssets: totalAssets,
              totalCurrentLiabilities: currentLiabilities,
              totalLongTermLiabilities: longTermLiabilities,
              totalLiabilities: totalLiabilities,
              totalStockholdersEquity: equity,
              totalLiabilitiesAndEquity: liabilitiesAndEquity
            };
          });


          // Helper function to process metrics
          const processMetric = (fieldName: string, isPercentage = false) => {
            return flattenedData.map((item: any) => {
              const value = item[fieldName] !== undefined ? item[fieldName] : 0;
              return {
                year: item.year,
                value: isPercentage && typeof value === 'string' ?
                  parseFloat(value.replace('%', '')) :
                  (parseFloat(value) || 0)
              };
            });
          };

          // Process data for each metric in optionsMap
          const processedChartData: Record<string, any[]> = {};

          // Process Income Statement metrics
          processedChartData["Net Sales"] = processMetric("netSales");
          processedChartData["Cost of Goods Sold"] = processMetric("costOfGoodsSold");
          processedChartData["Gross margin %"] = processMetric("grossMargin", true);
          processedChartData["Total Operating Expenses"] = processMetric("totalOperatingExpenses");
          processedChartData["Operating Expenses %"] = processMetric("operatingExpenses", true);
          processedChartData["Profit (Loss) from Operations %"] = processMetric("profitFromOperationsMargin", true);
          processedChartData["Total Other Income (Expense) %"] = processMetric("totalOtherIncomeMargin", true);
          processedChartData["Income (Loss) Before Income Taxes"] = processMetric("incomeBeforeTax");
          processedChartData["Pre-Tax Income %"] = processMetric("incomeBeforeTaxMargin", true);
          processedChartData["Net Income (Loss)"] = processMetric("netIncome");
          processedChartData["Net Income (Loss) %"] = processMetric("netIncomeMargin", true);

          // Process Balance Sheet metrics
          processedChartData["Total Current Assets"] = processMetric("totalCurrentAssets");
          processedChartData["Total Long-Term Asset"] = processMetric("totalLongTermAssets");
          processedChartData["Total Assets"] = processMetric("totalAssets");
          processedChartData["Total Current Liabilities"] = processMetric("totalCurrentLiabilities");
          processedChartData["Total Long-Term Liabilities"] = processMetric("totalLongTermLiabilities");
          processedChartData["Total Liabilities"] = processMetric("totalLiabilities");
          processedChartData["Total Stockholder's Equity"] = processMetric("totalStockholdersEquity");
          processedChartData["Total Liabilities and Equity"] = processMetric("totalLiabilitiesAndEquity");


          // Add forecast data
          const latestYear = Math.max(...sortedYears);

          // Generate forecast data for each metric
          Object.keys(processedChartData).forEach(metric => {
            if (metric !== "Stress Tests") {
              const metricData = processedChartData[metric];
              const forecastType = forecastTypes[metric] || 'average';
              const multiplier = multipliers[metric] !== undefined ? multipliers[metric] : 1.5;

              // Get the last few values to calculate average or apply multiplier
              const lastValues = metricData.slice(-3).map(item => item.value);

              // Generate forecast data points
              for (let i = 1; i <= forecastYears; i++) {
                const forecastYear = (latestYear + i).toString();
                let forecastValue;

                if (forecastType === 'average' && lastValues.length > 0) {
                  // Calculate average of last 3 values (or fewer if not enough data)
                  forecastValue = lastValues.reduce((sum, val) => sum + val, 0) / lastValues.length;
                } else {
                  // Use multiplier on the last value
                  const lastValue = metricData[metricData.length - 1]?.value || 0;
                  forecastValue = lastValue * (1 + multiplier / 100);
                }

                // Add forecast data point
                metricData.push({
                  year: forecastYear,
                  value: forecastValue,
                  isForecast: true // Mark as forecast data for styling
                });
              }
            }
          });

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
      } catch {
        // Handle error silently
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

  // Toggle function for stress tests
  const toggleStressSwitch = (index: number) => {
    setStressToggles((prev: boolean[]) => {
      const updatedToggles = [...prev];
      updatedToggles[index] = !updatedToggles[index];
      return updatedToggles;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
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
            {stressToggles.map((isOn, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Stress Test #{index + 1}</h3>
                  <div
                    className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300
                      ${isOn ? "bg-green-500" : "bg-gray-300"}`}
                    onClick={() => toggleStressSwitch(index)}
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

                            // Step 3: Format the tick value with commas and add $ sign
                            return `$${roundedTick.toLocaleString()}`;
                          }}
                        >
                          <Label value="Value (in $)" offset={100} position="insideRight" angle={-90} />
                        </YAxis>

                        <Tooltip content={<CustomTooltip />} />
                        {/* Render multiple lines for different stress test scenarios */}
                        <Line type="monotone" dataKey="goodsSoldCost" stroke="#8884d8" strokeWidth={2} name="Principal" />
                        <Line type="monotone" dataKey="grossProfit" stroke="#82ca9d" strokeWidth={2} name="Stress Effect" />
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
            {/* Income Statement Section */}
            <div className="space-y-6">
              {renderChartSection("Income Statement", optionsMap["Income Statement"], incomeToggles, setIncomeToggles)}
            </div>

            {/* White spacer */}
            <div className="-mx-5 my-16 bg-white h-12 w-auto"></div>


            {/* Balance Sheet Section */}
            <div className="pt-5 border-t border-gray-200">
              {renderChartSection("Balance Sheet", optionsMap["Balance Sheet"], balanceToggles, setBalanceToggles)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExecutiveHome;
