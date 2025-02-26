'use client'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatedFinancialReportCollection, FinancialReportCollection, TransformedFinancialReportCollection } from "@/lib/fetch";
import { calculateBalanceSheet, calculateIncomeStatement, getColumnLabel, transformCalculatedFinancialReportCollection } from "@/lib/financials";
import { useEffect, useState } from "react";

const ClientWrapper = () => {

    const [financials, setFinancials] = useState<TransformedFinancialReportCollection | null>(null);
    const [years, setYears] = useState<string[]>([]);
    const [forecastTypes, setForecastTypes] = useState<{ [key: string]: 'average' | 'multiplier' }>({});
    const [multipliers, setMultipliers] = useState<{ [key: string]: number }>({}); // State for individual multipliers

    useEffect(() => {
        const fetchData = async () => {
            const RESPONSE = await fetch(`/api/financials`, {
                method: 'GET',
                cache: 'no-store'
            });
            const FINANCIALS = await RESPONSE.json();
            const DATA: FinancialReportCollection = FINANCIALS.data;

            const CALCULATED_DATA: CalculatedFinancialReportCollection = {};
            Object.keys(DATA).forEach((year) => {
                CALCULATED_DATA[year] = {
                    income: calculateIncomeStatement(DATA[year].income),
                    balance: calculateBalanceSheet(DATA[year].balance),
                };
            });
            setYears(Object.keys(CALCULATED_DATA));
            setFinancials(transformCalculatedFinancialReportCollection(CALCULATED_DATA));
            console.log(transformCalculatedFinancialReportCollection(CALCULATED_DATA));
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
                <TabsList className="grid grid-cols-2 w-[400px]">
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="graph">Graph</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="table">
                {financials && (
                    <Table>
                        <TableCaption>THIS IS THE END</TableCaption>
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
                            {Object.keys(financials).map((label) => {
                                const key = label as keyof TransformedFinancialReportCollection;
                                const currentForecastType = forecastTypes[label] || 'average'; // Default to 'average' if not set
                                const currentMultiplier = multipliers[label] || 1.0; // Default multiplier is 1.0

                                return (
                                    <TableRow key={key}>
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
                                                '1.0' // Default multiplier for "average" forecast type
                                            )}
                                        </TableCell>
                                        <TableCell><div className="font-bold">{getColumnLabel(label)}</div></TableCell>
                                        {financials[key].map((item, index) => (
                                            <TableCell key={index}>{item}</TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </TabsContent>

            <TabsContent value="graph">
            </TabsContent>
        </Tabs>
    );
};

export default ClientWrapper;
