'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatedFinancialReportCollection, FinancialReportCollection, TransformedBalanceSheetCollection, TransformedIncomeStatementCollection } from "@/lib/fetch";
import { calculateBalanceSheet, calculateIncomeStatement, getColumnLabel, transformCalculatedFinancialReportCollection } from "@/lib/financials";
import { useEffect, useState } from "react";

const ClientWrapper = () => {
    const [balanceSheet, setBalanceSheet] = useState<TransformedBalanceSheetCollection | null>(null);
    const [incomeStatement, setIncomeStatement] = useState<TransformedIncomeStatementCollection | null>(null);
    const [years, setYears] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const RESPONSE = await fetch(`/api/financials`, {
                method: 'GET'
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
            const TRANSFORMED = transformCalculatedFinancialReportCollection(CALCULATED_DATA);
            setBalanceSheet(TRANSFORMED.balance);
            setIncomeStatement(TRANSFORMED.income);
        };
        fetchData();
    }, []);

    return (
        <Tabs defaultValue="table">
            <div className="flex justify-between items-center mb-5">
                <TabsList className="grid grid-cols-2 w-[400px]">
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="graph">Graph</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="table">
                {balanceSheet && incomeStatement ? (
                    <>
                        <Card className="mb-5">
                            <CardHeader>
                                <CardTitle className="text-xl text-center">Income Statement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead></TableHead>
                                            {years.map((year) => (
                                                <TableHead className="font-bold" key={year}>{year}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.keys(incomeStatement).map((label) => {
                                            const key = label as keyof TransformedIncomeStatementCollection;
                                            return (
                                                <TableRow key={key}>
                                                    <TableCell><div className="font-bold">{getColumnLabel(label)}</div></TableCell>
                                                    {incomeStatement[key].map((item, index) => (
                                                        <TableCell key={index}>{item}</TableCell>
                                                    ))}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl text-center">Balance Sheet</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead></TableHead>
                                            {years.map((year) => (
                                                <TableHead className="font-bold" key={year}>{year}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.keys(balanceSheet).map((label) => {
                                            const key = label as keyof TransformedBalanceSheetCollection;
                                            return (
                                                <TableRow key={key}>
                                                    <TableCell><div className="font-bold">{getColumnLabel(label)}</div></TableCell>
                                                    {balanceSheet[key].map((item, index) => (
                                                        <TableCell key={index}>{item}</TableCell>
                                                    ))}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                        <div className="h-48 rounded-xl bg-muted/50" />
                        <div className="h-48 rounded-xl bg-muted/50" />
                        <div className="h-48 rounded-xl bg-muted/50" />
                    </div>
                )}
            </TabsContent>

            <TabsContent value="graph">
            </TabsContent>
        </Tabs>
    );
};

export default ClientWrapper;
