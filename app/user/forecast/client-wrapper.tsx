'use client'
//npm install recharts
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialReportCollection } from "@/lib/fetch";   
import { getColumnLabel } from "@/lib/financials";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip} from "recharts";

const ClientWrapper = () => {
    const [incomeStatements, setIncomeStatements] = useState<Record<string, Record<string, number>>>({});
    const [balanceSheets, setBalanceSheets] = useState<Record<string, Record<string, number>>>({});
    const [years, setYears] = useState<string[]>([]);
    const [forecastTypes, setForecastTypes] = useState<{ [key: string]: 'average' | 'multiplier' }>({});
    const [multipliers, setMultipliers] = useState<{ [key: string]: number }>({});
    const [visibleCharts, setVisibleCharts] = useState<{ [label: string]: boolean }>({});

    useEffect(() => {
        const fetchData = async () => {
            const RESPONSE = await fetch(`/api/financials`, {
                method: 'GET',
                cache: 'no-store'
            });
            const FINANCIALS = await RESPONSE.json();
            const DATA: FinancialReportCollection = FINANCIALS.data;

            if (DATA) {
                const sortedYears = Object.keys(DATA).map(Number).sort((a, b) => a - b);
                setYears(sortedYears.map(String));

                const allBalanceSheets: Record<string, Record<string, number>> = {};
                const allIncomeStatements: Record<string, Record<string, number>> = {};

                sortedYears.forEach(year => {
                    const balanceData = DATA[year]?.balance || {};
                    const incomeData = DATA[year]?.income || {};

                    allBalanceSheets[year] = Object.fromEntries(
                        Object.entries(balanceData).map(([key, value]) => [key, value ?? 0])
                    );

                    allIncomeStatements[year] = Object.fromEntries(
                        Object.entries(incomeData).map(([key, value]) => [key, value ?? 0])
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

    const handleMultiplierChange = (label: string, value: string) => {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            setMultipliers((prevState) => ({
                ...prevState,
                [label]: numericValue,
            }));
        }
    };

    const toggleChart = (label: string) => {
        setVisibleCharts(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const extendedYears = [...years];
    const latestYear = parseInt(years[years.length - 1], 10);
    for (let i = 0; i < 5; i++) {
        extendedYears.push((latestYear + 1 + i).toString());
    }

    const renderRows = (data: Record<string, Record<string, number>>) =>
        Object.keys(data[years[0]] || {}).map((label) => {
            const currentForecastType = forecastTypes[label] || 'average';
            const currentMultiplier = multipliers[label] !== undefined ? multipliers[label] : 1.5;

            const existingValues = years.map(year => data[year]?.[label] ?? 0);
            const forecastedValues = [...existingValues];

            for (let i = 0; i < 5; i++) {
                const lastIndex = forecastedValues.length - 1;
                const prevValue = forecastedValues[lastIndex];
                let newValue: number;

                if (currentForecastType === 'average') {
                    const lastThreeValues = forecastedValues.slice(-3);
                    if (lastThreeValues.length === 3) {
                        newValue = Math.round(lastThreeValues.reduce((sum, v) => sum + v, 0) / 3);
                    } else {
                        newValue = Math.round(prevValue || 0);
                    }
                } else {
                    newValue = Math.round(prevValue + (prevValue * (currentMultiplier / 100)));
                }

                forecastedValues.push(newValue);
            }

            const chartData = extendedYears.map((year, i) => ({
                year,
                value: forecastedValues[i]
            }));

            return (
                <>
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
                            ) : '1.0'}
                        </TableCell>
                        <TableCell>
                            <div className="font-bold">{getColumnLabel(label)}</div>
                            <button
                                onClick={() => toggleChart(label)}
                                className="text-blue-600 underline text-sm mt-1"
                            >
                                {visibleCharts[label] ? "Hide Graph" : "Show Graph"}
                            </button>
                        </TableCell>
                        {forecastedValues.map((item, index) => (
                            <TableCell key={index}>
                                {typeof item === "number" ? item.toFixed(2) : "N/A"}
                            </TableCell>
                        ))}
                    </TableRow>

                    {visibleCharts[label] && (
                        <TableRow>
                            <TableCell colSpan={extendedYears.length + 3}>
                                <LineChart width={700} height={250} data={chartData}>
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
                                </LineChart>
                            </TableCell>
                        </TableRow>
                    )}
                </>
            );
        });

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
                            {renderRows(incomeStatements)}
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
                            {renderRows(balanceSheets)}
                        </TableBody>
                    </Table>
                )}
            </TabsContent>
        </Tabs>
    );
};

export default ClientWrapper;