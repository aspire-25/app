/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, {useState, useEffect} from "react";
import Image from "next/image";
import {CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

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
  const [forecastTypes, setForecastTypes] = useState<{ [key: string]: 'average' | 'multiplier' }>({});
  const [multipliers, setMultipliers] = useState<{ [key: string]: number }>({});
  const [showForecast, setShowForecast] = useState<boolean>(true);
  // State to track which graphs are visible in sustainability model
  const [visibleGraphs, setVisibleGraphs] = useState<{ [key: string]: boolean }>({});

  // Helper function to calculate percentages
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? (value / total * 100).toFixed(2) + "%" : "0%";
  };

  // Helper function to toggle graph visibility
  const toggleGraph = (option: string) => {
    setVisibleGraphs(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Helper function to render chart sections
  const renderChartSection = (title: string, options: string[]) => (
    <div className="mt-6">
      <div className="flex justify-center items-center mb-4">
        <h3 className="text-xl font-bold text-center">{title}</h3>
        <div className="flex-grow"></div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Show Forecast</span>
          <div
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300
              ${showForecast ? "bg-green-500" : "bg-gray-300"}`}
            onClick={toggleForecast}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300
                ${showForecast ? "translate-x-6" : "translate-x-0"}`}
            ></div>
          </div>
        </div>
      </div>
      
      {options.map((option) => {
        // Initialize visibility state if not set
        if (visibleGraphs[option] === undefined) {
          setVisibleGraphs(prev => ({
            ...prev,
            [option]: true // Default to visible
          }));
        }
        
        // Filter data based on forecast toggle
        const chartDataForOption = chartData[option] || [];
        const filteredData = showForecast 
          ? chartDataForOption 
          : chartDataForOption.filter(item => !item.isForecast);
        
        return (
          <div key={option} className="mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-semibold">{option}</h4>
                <div
                  className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300
                    ${visibleGraphs[option] ? "bg-green-500" : "bg-gray-300"}`}
                  onClick={() => toggleGraph(option)}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300
                      ${visibleGraphs[option] ? "translate-x-5" : "translate-x-0"}`}
                  ></div>
                </div>
              </div>
              {showForecast && (
                <div className="flex items-center gap-2">
                  <label className="text-sm">Forecast Type:</label>
                  <select
                    value={forecastTypes[option] || 'average'}
                    onChange={(e) => handleForecastTypeChange(option, e.target.value as 'average' | 'multiplier')}
                    className="bg-white p-1 border rounded text-sm"
                  >
                    <option value="average">Average</option>
                    <option value="multiplier">Multiplier</option>
                  </select>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <label className="text-sm">Multiplier:</label>
                    <span className="text-sm font-medium">
                      {(forecastTypes[option] || 'average') === 'multiplier' 
                        ? (multipliers[option] !== undefined ? multipliers[option] : 1.5) 
                        : 1.0}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {visibleGraphs[option] && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData} margin={{ top: 20, right: 20, bottom: 30, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    tickMargin={10}
                    domain={['dataMin', 'dataMax']}
                    type="category"
                    allowDataOverflow={false}
                  >
                    <Label value="Year" offset={-30} position="insideBottom" />
                  </XAxis>
                  <YAxis tickMargin={10} domain={['auto', (dataMax: number) => Math.ceil(dataMax / 500) * 500]}>
                    <Label value="Value (in $)" offset={100} position="insideRight" angle={-90} />
                  </YAxis>
                  <Tooltip content={<CustomTooltip />} />
                  {/* Split into two lines - one for historical data and one for forecast data */}
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Historical"
                    dot={{ fill: '#8884d8', r: 4 }}
                    connectNulls={true}
                    isAnimationActive={true}
                    data={filteredData.filter(item => !item.isForecast)}
                  />
                  
                  {showForecast && (
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Forecast"
                      dot={{ fill: '#82ca9d', r: 4 }}
                      connectNulls={true}
                      isAnimationActive={true}
                      data={filteredData.filter(item => item.isForecast)}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        );
      })}
    </div>
  );

  // Handle forecast type change with default multiplier setting
  const handleForecastTypeChange = (label: string, type: 'average' | 'multiplier') => {
    setForecastTypes((prevState) => ({
      ...prevState,
      [label]: type,
    }));
    
    // Set default multiplier value if switching to multiplier type
    if (type === 'multiplier' && multipliers[label] === undefined) {
      setMultipliers((prevState) => ({
        ...prevState,
        [label]: 1.5,
      }));
    }
  };

  // Toggle forecast display
  const toggleForecast = () => {
    setShowForecast(!showForecast);
  };

  // Store raw data for regenerating forecasts
  const [rawMetricData, setRawMetricData] = useState<Record<string, any[]>>({});
  
  // Generate forecast data based on current settings
  useEffect(() => {
    if (Object.keys(rawMetricData).length === 0) return;
    
    const processedChartData: Record<string, any[]> = {};
    
    // Process Income Statement metrics
    processedChartData["Net Sales"] = generateForecastData(rawMetricData["Net Sales"], "Net Sales");
    processedChartData["Cost of Goods Sold"] = generateForecastData(rawMetricData["Cost of Goods Sold"], "Cost of Goods Sold");
    processedChartData["Gross margin %"] = generateForecastData(rawMetricData["Gross margin %"], "Gross margin %");
    processedChartData["Total Operating Expenses"] = generateForecastData(rawMetricData["Total Operating Expenses"], "Total Operating Expenses");
    processedChartData["Operating Expenses %"] = generateForecastData(rawMetricData["Operating Expenses %"], "Operating Expenses %");
    processedChartData["Profit (Loss) from Operations %"] = generateForecastData(rawMetricData["Profit (Loss) from Operations %"], "Profit (Loss) from Operations %");
    processedChartData["Total Other Income (Expense) %"] = generateForecastData(rawMetricData["Total Other Income (Expense) %"], "Total Other Income (Expense) %");
    processedChartData["Income (Loss) Before Income Taxes"] = generateForecastData(rawMetricData["Income (Loss) Before Income Taxes"], "Income (Loss) Before Income Taxes");
    processedChartData["Pre-Tax Income %"] = generateForecastData(rawMetricData["Pre-Tax Income %"], "Pre-Tax Income %");
    processedChartData["Net Income (Loss)"] = generateForecastData(rawMetricData["Net Income (Loss)"], "Net Income (Loss)");
    processedChartData["Net Income (Loss) %"] = generateForecastData(rawMetricData["Net Income (Loss) %"], "Net Income (Loss) %");
    
    // Process Balance Sheet metrics
    processedChartData["Total Current Assets"] = generateForecastData(rawMetricData["Total Current Assets"], "Total Current Assets");
    processedChartData["Total Long-Term Asset"] = generateForecastData(rawMetricData["Total Long-Term Asset"], "Total Long-Term Asset");
    processedChartData["Total Assets"] = generateForecastData(rawMetricData["Total Assets"], "Total Assets");
    processedChartData["Total Current Liabilities"] = generateForecastData(rawMetricData["Total Current Liabilities"], "Total Current Liabilities");
    processedChartData["Total Long-Term Liabilities"] = generateForecastData(rawMetricData["Total Long-Term Liabilities"], "Total Long-Term Liabilities");
    processedChartData["Total Liabilities"] = generateForecastData(rawMetricData["Total Liabilities"], "Total Liabilities");
    processedChartData["Total Stockholder's Equity"] = generateForecastData(rawMetricData["Total Stockholder's Equity"], "Total Stockholder's Equity");
    processedChartData["Total Liabilities and Equity"] = generateForecastData(rawMetricData["Total Liabilities and Equity"], "Total Liabilities and Equity");
    
    // Add stress test data
    if (chartData["Stress Tests"]) {
      processedChartData["Stress Tests"] = chartData["Stress Tests"];
    }
    
    setChartData(processedChartData);
  }, [forecastTypes, multipliers, rawMetricData, chartData["Stress Tests"]]);

  // Helper function to generate forecast data
  const generateForecastData = (metricData: any[], metricName: string) => {
    if (!metricData || metricData.length === 0) return [];
    
    // Default forecast settings if not set
    const forecastType = forecastTypes[metricName] || 'average';
    const multiplierValue = multipliers[metricName] !== undefined ? multipliers[metricName] : 1.5;
    
    // Clone the existing data
    const existingData = metricData.filter(item => !item.isForecast);
    
    // Get the last year and extract the year number
    const lastDataPoint = existingData[existingData.length - 1];
    const lastYear = parseInt(lastDataPoint.year, 10);
    
    // Generate forecast data up to 2029
    const forecastData = [];
    const targetEndYear = 2029;
    
    for (let year = lastYear + 1; year <= targetEndYear; year++) {
      const forecastYear = year.toString();
      let forecastValue: number;
      
      if (forecastType === 'average') {
        // Calculate average of last 3 years if available
        const lastThreeValues = existingData.slice(-3).map(item => item.value);
        if (lastThreeValues.length === 3) {
          forecastValue = lastThreeValues.reduce((sum, val) => sum + val, 0) / 3;
        } else {
          // If less than 3 years of data, use the last value
          forecastValue = lastDataPoint.value;
        }
      } else {
        // Use multiplier: previous value + (previous value * multiplier/100)
        const prevIndex = year - lastYear - 1;
        const prevValue = prevIndex === 0 ? 
          lastDataPoint.value : 
          forecastData[prevIndex - 1].value;
        
        forecastValue = prevValue + (prevValue * (multiplierValue / 100));
      }
      
      forecastData.push({
        year: forecastYear,
        value: forecastValue,
        isForecast: true // Flag to identify forecast data points
      });
    }
    
    // Add isForecast: false flag to existing data
    const markedExistingData = existingData.map(item => ({
      ...item,
      isForecast: false
    }));
    
    // Return combined data
    return [...markedExistingData, ...forecastData];
  };
  
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
          const rawData: Record<string, any[]> = {};
          
          // Process Income Statement metrics
          rawData["Net Sales"] = processMetric("netSales");
          rawData["Cost of Goods Sold"] = processMetric("costOfGoodsSold");
          rawData["Gross margin %"] = processMetric("grossMargin", true);
          rawData["Total Operating Expenses"] = processMetric("totalOperatingExpenses");
          rawData["Operating Expenses %"] = processMetric("operatingExpenses", true);
          rawData["Profit (Loss) from Operations %"] = processMetric("profitFromOperationsMargin", true);
          rawData["Total Other Income (Expense) %"] = processMetric("totalOtherIncomeMargin", true);
          rawData["Income (Loss) Before Income Taxes"] = processMetric("incomeBeforeTax");
          rawData["Pre-Tax Income %"] = processMetric("incomeBeforeTaxMargin", true);
          rawData["Net Income (Loss)"] = processMetric("netIncome");
          rawData["Net Income (Loss) %"] = processMetric("netIncomeMargin", true);
          
          // Process Balance Sheet metrics
          rawData["Total Current Assets"] = processMetric("totalCurrentAssets");
          rawData["Total Long-Term Asset"] = processMetric("totalLongTermAssets");
          rawData["Total Assets"] = processMetric("totalAssets");
          rawData["Total Current Liabilities"] = processMetric("totalCurrentLiabilities");
          rawData["Total Long-Term Liabilities"] = processMetric("totalLongTermLiabilities");
          rawData["Total Liabilities"] = processMetric("totalLiabilities");
          rawData["Total Stockholder's Equity"] = processMetric("totalStockholdersEquity");
          rawData["Total Liabilities and Equity"] = processMetric("totalLiabilitiesAndEquity");
          
          // Store raw data for regenerating forecasts
          setRawMetricData(rawData);
          
          // Add stress test data (using sample data for now)
          const processedChartData: Record<string, any[]> = {};
        
          
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

  // Toggle function
  const toggleSwitch = (index: number) => {
    setToggles((prev: boolean[]) => {
      const updatedToggles = [...prev];
      updatedToggles[index] = !updatedToggles[index];
      return updatedToggles;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-4">
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
                        <XAxis 
                          dataKey="year" 
                          tickMargin={10}
                          domain={['dataMin', 'dataMax']}
                          type="category"
                          allowDataOverflow={false}
                        >
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
          <div className="space-y-6">
            {/* Render Income Statement Section */}
            <div className="p-5 border rounded bg-gray-100">
              {renderChartSection("Income Statement", optionsMap["Income Statement"])}
            </div>
            
            {/* White space between sections */}
            <div className="h-6"></div>
            
            {/* Render Balance Sheet Section */}
            <div className="p-5 border rounded bg-gray-100">
              {renderChartSection("Balance Sheet", optionsMap["Balance Sheet"])}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default ExecutiveHome;
