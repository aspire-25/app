'use client'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatedFinancialReportCollection, FinancialReportCollection, TransformedFinancialReportCollection } from "@/lib/fetch";
import { calculateBalanceSheet, calculateIncomeStatement, getColumnLabel, transformCalculatedFinancialReportCollection } from "@/lib/financials";
import { useEffect, useState } from "react";

const ClientWrapper = () => {

    const [financials, setFinancials] = useState<TransformedFinancialReportCollection | null>(null);
    const [years, setYears] = useState<string[]>([]);

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
                                <TableHead></TableHead>
                                {years.map((year) => (
                                    <TableHead className="font-bold" key={year}>{year}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.keys(financials).map((label) => {
                                const key = label as keyof TransformedFinancialReportCollection;
                                return (
                                    <TableRow key={key}>
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
