'use client';

import React, { useState, useEffect } from 'react';


const calculateGrossProfit = (netSales: number, costOfGoodsSold: number) => netSales - (costOfGoodsSold);
const calculateGrossMargin = (grossProfit: number, netSales: number) => (grossProfit / netSales);
const calculateTotalOperatingExpenses = (salaries: number, rent: number, depreciation: number, interest: number) => salaries + rent + depreciation + interest;
const calculateOperatingExpensesPercentage = (salaries: number, rent: number, depreciation: number, interest: number, netSales: number) => ((salaries + rent + depreciation + interest) / netSales ) * 100;
const calculateProfitLossOperations = (totalOperatingExpenses: number, netSales: number) => (totalOperatingExpenses / netSales) * 100
const calculateOtherIncomeExpense = (interestIncome: number, interestExpense: number, gainLossOnAssets: number) => interestIncome - interestExpense + gainLossOnAssets;
const calculateIncomeBeforeTaxes = (netIncome: number, otherIncomeExpense: number) => netIncome + otherIncomeExpense;
const calculatePreTaxIncomePercentage = (incomeBeforeTaxes: number, netSales: number) => (incomeBeforeTaxes / netSales) * 100;
const calculateProfitLossOperationsPercentage = (profitLossOperation: number, netSales: number): number => (profitLossOperation / netSales) * 100;

const IncomeStatement: React.FC = () => {
  const [revenue, setRevenue] = useState(0);
  const [netSales, setNetSales] = useState(0);
  const [costOfContracting, setCostOfContracting] = useState(0);
  const [overhead, setOverhead] = useState(0);
  const [salariesAndBenefits, setSalariesSndBenefits] = useState(0);
  const [rentAndOverhead, setRentAndOverhead] = useState(0);
  const [depreciationAmortization, setDepreciationAmortization] = useState(0);
  const [interest, setInterest] = useState(0);
  const [interestIncome, setInterestIncome] = useState(0);
  const [interestExpense, setInterestExpense] = useState(0);
  const [gainLossOnAssets, setGainLossOnAssets] = useState(0);
  const [incomeTaxes, setIncomeTaxes] = useState(0);
  const [netIncome, setNetIncome] = useState(0); 
  const [saveStatus, setSaveStatus] = useState("All changes saved.");
    
  // Auto calculations
  const grossProfit = calculateGrossProfit(netSales, costOfContracting + overhead);
  const grossMargin = calculateGrossMargin(grossProfit, netSales);

  const totalOperatingExpenses = calculateTotalOperatingExpenses(salariesAndBenefits, rentAndOverhead, depreciationAmortization, interest);
  const operatingExpensesPercentage = calculateOperatingExpensesPercentage(salariesAndBenefits, rentAndOverhead, depreciationAmortization, interest, netSales);
  const profitLossOperations = calculateProfitLossOperations(totalOperatingExpenses, netSales);
  const profitLossOperationsPercentage = calculateProfitLossOperationsPercentage(profitLossOperations, netSales);

  const otherIncomeExpense = calculateOtherIncomeExpense(interestIncome, interestExpense, gainLossOnAssets);
  const incomeBeforeTaxes = calculateIncomeBeforeTaxes(netIncome, otherIncomeExpense);
  const preTaxIncomePercentage = calculatePreTaxIncomePercentage(incomeBeforeTaxes, 100); //
// Auto-save handler 
const autoSave = (name: string, value: number) => {
    console.log(`Auto-saving ${name}: ${value}`);
    // Logic for auto-saving tbd
  };

  useEffect(() => {
    setSaveStatus("Saving...");
    const timer = setTimeout(() => {
      setSaveStatus("All changes saved.");
    }, 1500); // Simulated save delay of 1.5 seconds

    return () => clearTimeout(timer); // Cleanup function
  }, [revenue, netSales, costOfContracting, overhead]);
  useEffect(() => {
    autoSave('Net Sales', netSales);
  }, [netSales]);

  useEffect(() => {
    autoSave('Cost of Contracting', costOfContracting);
  }, [costOfContracting]);

  useEffect(() => {
    autoSave('Overhead', overhead);
  }, [overhead]);

  useEffect(() => {
    autoSave('Salaries and Benefits', salariesAndBenefits);
  }, [salariesAndBenefits]);

  useEffect(() => {
    autoSave('Rent and Overhead', rentAndOverhead);
  }, [rentAndOverhead]);

  useEffect(() => {
    autoSave('Depreciation and Amortization', depreciationAmortization);
  }, [depreciationAmortization]);

  useEffect(() => {
    autoSave('Interest', interest);
  }, [interest]);

  useEffect(() => {
    autoSave('Interest Income', interestIncome);
  }, [interestIncome]);

  useEffect(() => {
    autoSave('Interest Expense', interestExpense);
  }, [interestExpense]);

  useEffect(() => {
    autoSave('Gain/Loss on Assets', gainLossOnAssets);
  }, [gainLossOnAssets]);

  useEffect(() => {
    autoSave('Income Taxes', incomeTaxes);
  }, [incomeTaxes]);

  useEffect(() => {
    autoSave('Net Income', netIncome);
  }, [netIncome]);


  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="fixed top-0 left-0 w-full bg-white shadow-md p-4 text-center text-2xl font-bold z-50">
      Income Statement
      </div>
      {/* Revenue + Net Sales Card */}
      <div className="card bg-white p-6 rounded-lg shadow-lg min-h-[200px]">
        <h3 className="text-xl font-semibold mb-4">Overview</h3>
        <form className="space-y-4">
          <div className="flex space-x-6">
            <div className="flex-1">
              <label className="block font-medium">Revenue:</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(parseInt(e.target.value))}
                className="w-full p-3 border rounded-md"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium">Net Sales:</label>
              <input
                type="number"
                value={netSales}
                onChange={(e) => setNetSales(parseInt(e.target.value))}
                className="w-full p-3 border rounded-md"
                required
              />
            </div>
          </div>
        </form>
      </div>
  
      {/* Cost of Goods Sold Card */}
      <div className="card bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
        <h3 className="text-xl font-semibold mb-4">Cost of Goods Sold</h3>
        <div className="flex justify-between space-x-6">
          <div className="w-1/2">
            <form className="space-y-4">
              <div>
                <label className="block font-medium">Cost of Contracting:</label>
                <input
                  type="number"
                  value={costOfContracting}
                  onChange={(e) => setCostOfContracting(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Overhead:</label>
                <input
                  type="number"
                  value={overhead}
                  onChange={(e) => setOverhead(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
            </form>
          </div>
          <div className="w-1/2 space-y-4">
            <div>
              <label className="block font-medium">Cost of Goods Sold:</label>
              <input
                type="text"
                value={costOfContracting + overhead}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Gross Profit:</label>
              <input
                type="text"
                value={netSales - (costOfContracting + overhead)}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Gross Margin %:</label>
              <input
                type="text"
                value={grossMargin}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
  
      {/* Operating Expenses Card */}
      <div className="card bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
        <h3 className="text-xl font-semibold mb-4">Operating Expenses</h3>
        <div className="flex justify-between space-x-6">
          <div className="w-1/2">
            <form className="space-y-4">
              <div>
                <label className="block font-medium">Salaries and Benefits:</label>
                <input
                  type="number"
                  value={salariesAndBenefits}
                  onChange={(e) => setSalariesSndBenefits(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Rent and Overhead:</label>
                <input
                  type="number"
                  value={rentAndOverhead}
                  onChange={(e) => setRentAndOverhead(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Depreciation and Amortization:</label>
                <input
                  type="number"
                  value={depreciationAmortization}
                  onChange={(e) => setDepreciationAmortization(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Interest:</label>
                <input
                  type="number"
                  value={interest}
                  onChange={(e) => setInterest(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
            </form>
          </div>
          <div className="w-1/2 space-y-4">
            <div>
              <label className="block font-medium">Total Operating Expenses:</label>
              <input
                type="text"
                value={totalOperatingExpenses}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Operating Expenses %:</label>
              <input
                type="text"
                value={operatingExpensesPercentage}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
            <div className="w-1/2 space-y-4">
            <div>
              <label className="block font-medium">Profit (Loss) from Operations:</label>
              <input
                type="text"
                value={profitLossOperations}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Profit (Loss) from Operations %:</label>
              <input
                type="text"
                value={profitLossOperationsPercentage}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
          {/* Other Income (Expense) Card */}
          <div className="card bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
        <h3 className="text-xl font-semibold mb-4">Other Income (Expense)</h3>
        <div className="flex justify-between space-x-6">
          <div className="w-1/2">
            <form className="space-y-4">
              <div>
                <label className="block font-medium">Interest Income:</label>
                <input
                  type="number"
                  value={interestIncome}
                  onChange={(e) => setInterestIncome(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Interest Expense:</label>
                <input
                  type="number"
                  value={interestExpense}
                  onChange={(e) => setInterestExpense(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Gain/Loss on Disposal of Assets:</label>
                <input
                  type="number"
                  value={gainLossOnAssets}
                  onChange={(e) => setGainLossOnAssets(parseInt(e.target.value))}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div>
              <label className="block font-medium">Other Income (Expense):</label>
              <input
                type="text"
                value={otherIncomeExpense}
                required
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium">Income Taxes:</label>
              <input
                type="text"
                value={otherIncomeExpense}
                required
                className="w-full p-3 border rounded-md"
              />
            </div>
            </form>
          </div>
          <div className="w-1/2 space-y-4">
          <div>
              <label className="block font-medium">Total Other Income (Expense):</label>
              <input
                type="text"
                value={incomeBeforeTaxes}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Total Other Income (Expense) %:</label>
              <input
                type="text"
                value={incomeBeforeTaxes}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Income (Loss) Before Income Taxes:</label>
              <input
                type="text"
                value={incomeBeforeTaxes}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Pre-Tax Income %:</label>
              <input
                type="text"
                value={preTaxIncomePercentage}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Net Income (Loss):</label>
              <input
                type="text"
                value={preTaxIncomePercentage}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium">Net Income (Loss) %:</label>
              <input
                type="text"
                value={preTaxIncomePercentage}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Autosave Bar */}
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-2 text-center text-sm">
    {saveStatus}
    </div>
  </div>
  );
};

export default IncomeStatement;