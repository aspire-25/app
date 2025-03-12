'use client'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialReportCollection } from "@/lib/fetch";   
import { getColumnLabel } from "@/lib/financials";
import { useEffect, useState } from "react";

const ClientWrapper = () => {
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

                sortedYears.forEach(year => {
                    const balanceData = DATA[year]?.balance || {};
    
                    allBalanceSheets[year] = Object.fromEntries(
                        Object.entries(balanceData)
                        //.filter(([key, value]) => typeof value === "number") // Exclude non-numeric properties
                        .map(([key, value]) => [key, value ?? 0]) // Replace null with 0
                    );
                });

                setBalanceSheets(allBalanceSheets);
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

    const handleMultiplierChange = (label: string, value: string) => {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            setMultipliers((prevState) => ({
                ...prevState,
                [label]: numericValue,
            }));
        }
    };

    return (
        <Tabs defaultValue="table">
            <div className="flex justify-between items-center mb-5">
                <TabsList className="grid grid-cols-1 w-[200px]">
                    <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="table">
                {Object.keys(balanceSheets).length > 0 && (
                    <Table>
                        <TableCaption>Balance Sheet Forecast</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Forecast Type</TableHead>
                                <TableHead>Multiplier</TableHead>
                                <TableHead></TableHead>
                                {years.map((year) => (
                                    <TableHead className="font-bold" key={year}>{year}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.keys(balanceSheets[years[0]] || {}).map((label) => {
                                const currentForecastType = forecastTypes[label] || 'average'; 
                                const currentMultiplier = multipliers[label] || 1.0;

                                // Get existing values for each year
                                const existingValues = years.map(year => balanceSheets[year]?.[label] ?? 0);

                                // Generate forecasted values
                                const forecastedValues = [...existingValues];
                                for (let i = 0; i < 5; i++) {
                                    const lastIndex = forecastedValues.length - 1;
                                    const currentValue = forecastedValues[lastIndex]; // This represents the current value (e.g., I45)

                                    let newValue: number;
    
                                    if (currentForecastType === 'average') {
                                        // For "AVERAGE", calculate the average of the first value and the last two values
                                        const previousValue = forecastedValues[0]; // This represents E45 (the first value)
                                        const twoLastValues = forecastedValues.slice(-2); // These represent H45 and I45 (the last two values)
        
                                        newValue = (previousValue + twoLastValues.reduce((sum, v) => sum + v, 0)) / 3; // Average formula: (E45 + H45 + I45) / 3
                                    } else {
                                        // For "MULTIPLIER", calculate the new value using the formula: I45 + (I45 * G45)
                                        const multiplier = multipliers[label] || 1.0; // You can get this multiplier from the state
                                        newValue = currentValue + (currentValue * multiplier); // Multiplier formula: I45 + (I45 * G45)
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
                                                <input
                                                    type="number"
                                                    value={currentMultiplier}
                                                    onChange={(e) => handleMultiplierChange(label, e.target.value)}
                                                    className="w-full p-1 border rounded"
                                                    min="0" step="any"
                                                />
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
