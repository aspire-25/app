'use client'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialReportCollection } from "@/lib/fetch";   
import { getColumnLabel } from "@/lib/financials";
import { useEffect, useState } from "react";

const ClientWrapper = () => {
    const [incomeStatements, setIncomeStatements] = useState<Record<string, Record<string, number>>>({});
    const [balanceSheets, setBalanceSheets] = useState<Record<string, Record<string, number>>>({});
    const [years, setYears] = useState<string[]>([]);
    const [forecastTypes, setForecastTypes] = useState<{ [key: string]: 'average' | 'multiplier' }>({});
    const [multipliers, setMultipliers] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchData = async () => {
            const RESPONSE = await fetch(`/api/financials`, {
                method: 'GET',
                cache: 'no-store'
            });
            const FINANCIALS = await RESPONSE.json();
            const DATA: FinancialReportCollection = FINANCIALS.data;

            console.log("Fetched Financial Data:", DATA); // Debugging

            if (DATA) {
                const sortedYears = Object.keys(DATA).map(Number).sort((a, b) => a - b);
                setYears(sortedYears.map(String));

                const allBalanceSheets: Record<string, Record<string, number>> = {};
                const allIncomeStatements: Record<string, Record<string, number>> = {};

                sortedYears.forEach(year => {
                    const balanceData = DATA[year]?.balance || {};
                    const incomeData = DATA[year]?.income || {};
    
                    allBalanceSheets[year] = Object.fromEntries(
                        Object.entries(balanceData)
                        //.filter(([key, value]) => typeof value === "number") // Exclude non-numeric properties
                        .map(([key, value]) => [key, value ?? 0]) 
                    );

                    allIncomeStatements[year] = Object.fromEntries(
                        Object.entries(incomeData)
                        //.filter(([key, value]) => typeof value === "number") // Exclude non-numeric properties
                        .map(([key, value]) => [key, value ?? 0]) 
                    );
                });

                setBalanceSheets(allBalanceSheets);
                setIncomeStatements(allIncomeStatements);
            }
        };
        fetchData();
    }, []);

    const handleForecastTypeChange = (label: string, type: 'average' | 'multiplier') => {
        setForecastTypes((prevState) => ({
            ...prevState,
            [label]: type,
        }));
    };

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleMultiplierChange = (label: string, value: string) => {
        const numericValue = parseFloat(value);
        
        // Validate the multiplier value
        let error = '';
        if (isNaN(numericValue)) {
            error = 'Please enter a valid number';
        } else if (numericValue < -100) {
            error = 'Multiplier cannot be less than -100%';
        } else if (numericValue > 1000) {
            error = 'Multiplier cannot exceed 1000%';
        }
        
        // Update validation errors
        setValidationErrors(prev => ({
            ...prev,
            [label]: error
        }));
        
        // Only update if there's no error
        if (!error && !isNaN(numericValue)) {
            setMultipliers((prevState) => ({
                ...prevState,
                [label]: numericValue,
            }));
        }
    };

    // Generate forecast years starting from the latest year
    const extendedYears = [...years];
    const latestYear = parseInt(years[years.length - 1], 10);
    for (let i = 0; i < 5; i++) {
        extendedYears.push((latestYear + 1 + i).toString());
    }

    return (
        <Tabs defaultValue="incomeStatement">
            <div className="flex justify-between items-center mb-5">
                <TabsList className="flex flex-row space-x-4">
                    <TabsTrigger value="incomeStatement">Income Statement Forecast</TabsTrigger>
                    <TabsTrigger value="balanceSheet">Balance Sheet Forecast</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="incomeStatement">
                {Object.keys(incomeStatements).length > 0 && (
                    <Table>
                        <TableCaption>Income Statement Forecast</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Forecast Type</TableHead>
                                <TableHead>Multiplier</TableHead>
                                <TableHead></TableHead>
                                {extendedYears.map((year) => (
                                    <TableHead className="font-bold" key={year}>{year}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.keys(incomeStatements[years[0]] || {}).map((label) => {
                                const currentForecastType = forecastTypes[label] || 'average'; 
                                const currentMultiplier = multipliers[label] !== undefined ? multipliers[label] : 1.5;

                                // Get existing values for each year
                                const existingValues = years.map(year => incomeStatements[year]?.[label] ?? 0);

                                // Generate forecasted values
                                const forecastedValues = [...existingValues];

                                for (let i = 0; i < 5; i++) {
                                    const lastIndex = forecastedValues.length - 1;
                                    const prevValue = forecastedValues[lastIndex]; // This represents the current value (e.g., I45)

                                    let newValue: number;
    
                                    if (currentForecastType === 'average') {
                                        // For "AVERAGE", calculate the average of the last three values
                                        const lastThreeValues = forecastedValues.slice(-3); // Get the last three values
                                        
                                        if (lastThreeValues.length === 3) {
                                            newValue = Math.round(lastThreeValues.reduce((sum, v) => sum + v, 0) / 3); // Round the average normally
                                        } else {
                                            newValue = Math.round(prevValue || 0); //default to last value
                                        }
                                    } else {
                                        // For "MULTIPLIER", calculate the new value using the updated formula: a + (a * multiplier)
                                        newValue = Math.round(prevValue + (prevValue * (currentMultiplier/100))); // Updated calculation
                                    }
    
                                    forecastedValues.push(newValue);
                                }


                                return (
                                    <TableRow key={label}>
                                        <TableCell>
                                            <select
                                                value={currentForecastType}
                                                onChange={(e) => handleForecastTypeChange(label, e.target.value as 'average' | 'multiplier')}
                                                className="bg-white p-1 border rounded"
                                            >
                                                <option value="average">Average</option>
                                                <option value="multiplier">Multiplier</option>
                                            </select>
                                        </TableCell>
                                        <TableCell>
                                            {currentForecastType === 'multiplier' ? (
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={currentMultiplier}
                                                        onChange={(e) => handleMultiplierChange(label, e.target.value)}
                                                        className={`w-full p-1 border rounded ${validationErrors[label] ? 'border-red-500' : ''}`}
                                                        min="-100" max="1000" step="any"
                                                    />
                                                    {validationErrors[label] && (
                                                        <p className="text-red-500 text-xs mt-1">{validationErrors[label]}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                '1.0'
                                            )}
                                        </TableCell>
                                        <TableCell><div className="font-bold">{getColumnLabel(label)}</div></TableCell>
                                        {forecastedValues.map((item, index) => (
                                            <TableCell key={index}>
                                                {typeof item === "number" ? item.toFixed(2) : "N/A"}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </TabsContent>

            <TabsContent value="balanceSheet">
                {Object.keys(balanceSheets).length > 0 && (
                    <Table>
                        <TableCaption>Balance Sheet Forecast</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Forecast Type</TableHead>
                                <TableHead>Multiplier</TableHead>
                                <TableHead></TableHead>
                                {extendedYears.map((year) => (
                                    <TableHead className="font-bold" key={year}>{year}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.keys(balanceSheets[years[0]] || {}).map((label) => {
                                const currentForecastType = forecastTypes[label] || 'average'; 
                                const currentMultiplier = multipliers[label] !== undefined ? multipliers[label] : 1.5;

                                // Get existing values for each year
                                const existingValues = years.map(year => balanceSheets[year]?.[label] ?? 0);

                                // Generate forecasted values
                                const forecastedValues = [...existingValues];

                                for (let i = 0; i < 5; i++) {
                                    const lastIndex = forecastedValues.length - 1;
                                    const prevValue = forecastedValues[lastIndex]; // This represents the current value (e.g., I45)

                                    let newValue: number;
    
                                    if (currentForecastType === 'average') {
                                        // For "AVERAGE", calculate the average of the last three values
                                        const lastThreeValues = forecastedValues.slice(-3); // Get the last three values
                                        
                                        if (lastThreeValues.length === 3) {
                                            newValue = Math.round(lastThreeValues.reduce((sum, v) => sum + v, 0) / 3); // Round the average normally
                                        } else {
                                            newValue = Math.round(prevValue || 0); //default to last value
                                        }
                                    } else {
                                        // For "MULTIPLIER", calculate the new value using the updated formula: a + (a * multiplier)
                                        newValue = Math.round(prevValue + (prevValue * (currentMultiplier/100))); // Updated calculation
                                    }
    
                                    forecastedValues.push(newValue);
                                }


                                return (
                                    <TableRow key={label}>
                                        <TableCell>
                                            <select
                                                value={currentForecastType}
                                                onChange={(e) => handleForecastTypeChange(label, e.target.value as 'average' | 'multiplier')}
                                                className="bg-white p-1 border rounded"
                                            >
                                                <option value="average">Average</option>
                                                <option value="multiplier">Multiplier</option>
                                            </select>
                                        </TableCell>
                                        <TableCell>
                                            {currentForecastType === 'multiplier' ? (
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={currentMultiplier}
                                                        onChange={(e) => handleMultiplierChange(label, e.target.value)}
                                                        className={`w-full p-1 border rounded ${validationErrors[label] ? 'border-red-500' : ''}`}
                                                        min="-100" max="1000" step="any"
                                                    />
                                                    {validationErrors[label] && (
                                                        <p className="text-red-500 text-xs mt-1">{validationErrors[label]}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                '1.0'
                                            )}
                                        </TableCell>
                                        <TableCell><div className="font-bold">{getColumnLabel(label)}</div></TableCell>
                                        {forecastedValues.map((item, index) => (
                                            <TableCell key={index}>
                                                {typeof item === "number" ? item.toFixed(2) : "N/A"}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </TabsContent>
        </Tabs>
    );
};

export default ClientWrapper;
