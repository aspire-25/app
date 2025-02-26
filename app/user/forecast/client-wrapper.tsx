'use client';

import { BalanceSheet, FinancialReport, IncomeStatement } from "@/lib/fetch";
import { useEffect, useReducer, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DollarSign, Loader2, Plus, Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

const INITIAL_STATE: FinancialReport = {
    balance: {
        id: null,
        year: new Date().getFullYear(),
        cash: null,
        accountReceivable: null,
        inventory: null,
        longTermProperty: null,
        longTermAsset: null,
        accountPayable: null,
        currentDebtService: null,
        taxPayable: null,
        longTermDebtService: null,
        loanPayable: null,
        equityCapital: null,
        retainedEarning: null
    },
    income: {
        id: null,
        year: new Date().getFullYear(),
        revenue: null,
        contractingCost: null,
        overhead: null,
        salary: null,
        rent: null,
        depreciation: null,
        operatingInterest: null,
        interestIncome: null,
        interestExpense: null,
        assetGain: null,
        otherIncome: null,
        incomeTax: null
    }
};

type Action =
    | { type: 'UPDATE_BALANCE'; field: keyof BalanceSheet; value: number | null }
    | { type: 'UPDATE_INCOME'; field: keyof IncomeStatement; value: number | null }
    | { type: 'SET_FINANCIALS'; data: FinancialReport }
    | { type: 'UPDATE_YEAR'; year: number | null };

const reducer = (state: FinancialReport, action: Action) => {
    switch (action.type) {
        case 'UPDATE_BALANCE': {
            return {
                ...state,
                balance: {
                    ...state.balance,
                    [action.field]: action.value
                }
            };
        }
        case 'UPDATE_INCOME':
            return {
                ...state,
                income: {
                    ...state.income,
                    [action.field]: action.value
                }
            };
        case 'UPDATE_YEAR':
            return {
                balance: {
                    ...state.balance,
                    year: action.year,
                },
                income: {
                    ...state.income,
                    year: action.year,
                }
            };
        case 'SET_FINANCIALS':
            return {
                balance: action.data.balance ?? INITIAL_STATE.balance,
                income: action.data.income ?? INITIAL_STATE.income,
            };
        default:
            return state;
    }
}

const ClientWrapper = ({ year }: { year: number | null }) => {
    const [financials, dispatchFinancials] = useReducer(reducer, INITIAL_STATE);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (year) {
            const fetchData = async () => {
                const RESPONSE = await fetch(`/api/financials`, {
                    method: 'GET',
                    cache: 'no-store'
                });
                const FINANCIALS = await RESPONSE.json();
                const DATA: FinancialReport = FINANCIALS.data[year]
                dispatchFinancials({ type: 'SET_FINANCIALS', data: DATA });
            };
            fetchData();
        } else {
            dispatchFinancials({ type: 'SET_FINANCIALS', data: INITIAL_STATE });
        }
    }, [year]);

    const handleIncomeChange = (field: keyof IncomeStatement, value: string) => {
        const PARSED_VALUE = value.trim() === "" || isNaN(Number(value)) ? null : parseFloat(value);
        dispatchFinancials({ type: 'UPDATE_INCOME', field, value: PARSED_VALUE });
    };

    const handleBalanceChange = (field: keyof BalanceSheet, value: string) => {
        const PARSED_VALUE = value.trim() === "" || isNaN(Number(value)) ? null : parseFloat(value);
        dispatchFinancials({ type: 'UPDATE_BALANCE', field, value: PARSED_VALUE });
    };

    const handleYearChange = (value: string) => {
        const PARSED_VALUE = value.trim() === "" || isNaN(Number(value)) ? null : parseFloat(value);
        dispatchFinancials({ type: 'UPDATE_YEAR', year: PARSED_VALUE });
    };

    const handleSave = async () => {
        setIsLoading(true);
        const RESPONSE = await fetch(`/api/financials`, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(financials)
        });
        setIsLoading(false);
        if (RESPONSE.ok) {
            router.push(`/user/financials/${financials.income.year}`);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        const RESPONSE = await fetch(`/api/financials`, {
            method: 'DELETE',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ year: financials.income.year })
        });
        setIsLoading(false);
        if (RESPONSE.ok) {
            revalidatePath('/user/financials', 'layout');
            router.push(`/user/financials`);
        }
    };

    const renderInput = (
        value: number | null,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    ) => (
        <div className="relative">
            <span className="absolute inset-y-0 left-2 flex items-center">
                <DollarSign className="w-4 h-4" />
            </span>
            <Input className="pl-6" value={value ?? ""} onChange={onChange} />
        </div>
    );

    return (
        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <Tabs defaultValue="income">
                <div className="flex justify-between items-center mb-5">
                    <TabsList className="grid grid-cols-2 w-[400px]">
                        <TabsTrigger value="income">Income Statement</TabsTrigger>
                        <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
                    </TabsList>
                    <div className="flex space-x-2">
                        {year ?
                            <>
                                <Button disabled={isLoading} onClick={handleSave}>
                                    {isLoading ?
                                        <>
                                            <Loader2 className="animate-spin" />
                                            Saving...
                                        </>
                                        :
                                        <>
                                            <Save />
                                            Save Changes
                                        </>
                                    }

                                </Button>
                                <Button variant="destructive" size="icon" disabled={isLoading} onClick={handleDelete}>
                                    {isLoading ?
                                        <Loader2 className="animate-spin" />
                                        :
                                        <Trash />
                                    }
                                </Button>
                            </>
                            :
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input value={financials.income.year ?? ""} placeholder="Enter Year" onChange={e => handleYearChange(e.target.value)} />
                                <Button disabled={!financials.income.year || isLoading} onClick={handleSave}>
                                    {isLoading ?
                                        <>
                                            <Loader2 className="animate-spin" />
                                            Adding...
                                        </>
                                        :
                                        <>
                                            <Plus />
                                            Add
                                        </>
                                    }
                                </Button>
                            </div>
                        }
                    </div>
                </div>

                <TabsContent value="income">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue & Direct Costs</CardTitle>
                                <CardDescription>
                                    Update your revenue figures along with direct contracting costs and overhead adjustments.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label>Revenue</Label>
                                    {renderInput(financials.income.revenue, e => handleIncomeChange("revenue", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Cost of Contracting</Label>
                                    {renderInput(financials.income.contractingCost, e => handleIncomeChange("contractingCost", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Overhead</Label>
                                    {renderInput(financials.income.overhead, e => handleIncomeChange("overhead", e.target.value))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Operating Expenses</CardTitle>
                                <CardDescription>
                                    Enter details for day-to-day costs including salaries, rent, depreciation, and operating interest.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label>Salaries and Benefits</Label>
                                    {renderInput(financials.income.salary, e => handleIncomeChange("salary", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Rent and Overhead</Label>
                                    {renderInput(financials.income.rent, e => handleIncomeChange("rent", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Depreciation and Amortization</Label>
                                    {renderInput(financials.income.depreciation, e => handleIncomeChange("depreciation", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Interest</Label>
                                    {renderInput(financials.income.operatingInterest, e => handleIncomeChange("operatingInterest", e.target.value))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Adjustments & Other Income</CardTitle>
                                <CardDescription>
                                    Manage interest incomes/expenses, gains or losses on asset disposal, additional income, and tax liabilities.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label>Interest Income</Label>
                                    {renderInput(financials.income.interestIncome, e => handleIncomeChange("interestIncome", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Interest Expense</Label>
                                    {renderInput(financials.income.interestExpense, e => handleIncomeChange("interestExpense", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Gain (Loss) on Disposal of Assets</Label>
                                    {renderInput(financials.income.assetGain, e => handleIncomeChange("assetGain", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Other Income (Expense)</Label>
                                    {renderInput(financials.income.otherIncome, e => handleIncomeChange("otherIncome", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Income Taxes</Label>
                                    {renderInput(financials.income.incomeTax, e => handleIncomeChange("incomeTax", e.target.value))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="balance">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Asset</CardTitle>
                                <CardDescription>
                                    Enter details of your company&apos;s assets, including cash, receivables, inventory, property, and investments.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label>Cash and Cash Equivalents</Label>
                                    {renderInput(financials.balance.cash, e => handleBalanceChange("cash", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Accounts Receivable</Label>
                                    {renderInput(financials.balance.accountReceivable, e => handleBalanceChange("accountReceivable", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Inventory</Label>
                                    {renderInput(financials.balance.inventory, e => handleBalanceChange("inventory", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Property, Plant, and Equipment</Label>
                                    {renderInput(financials.balance.longTermProperty, e => handleBalanceChange("longTermProperty", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Investment</Label>
                                    {renderInput(financials.balance.longTermAsset, e => handleBalanceChange("longTermAsset", e.target.value))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Liabilities and Equity</CardTitle>
                                <CardDescription>
                                    Record your financial obligations such as payables, debts, and taxes, along with equity components like capital and retained earnings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label>Accounts Payable</Label>
                                    {renderInput(financials.balance.accountPayable, e => handleBalanceChange("accountPayable", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Current Debt Service</Label>
                                    {renderInput(financials.balance.currentDebtService, e => handleBalanceChange("currentDebtService", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Taxes Payable</Label>
                                    {renderInput(financials.balance.taxPayable, e => handleBalanceChange("taxPayable", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Long-term Debt Service</Label>
                                    {renderInput(financials.balance.longTermDebtService, e => handleBalanceChange("longTermDebtService", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Loans Payable</Label>
                                    {renderInput(financials.balance.loanPayable, e => handleBalanceChange("loanPayable", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Equity Capital</Label>
                                    {renderInput(financials.balance.equityCapital, e => handleBalanceChange("equityCapital", e.target.value))}
                                </div>
                                <div className="space-y-1">
                                    <Label>Retained Earnings</Label>
                                    {renderInput(financials.balance.retainedEarning, e => handleBalanceChange("retainedEarning", e.target.value))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
            {/**<div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />*/}
        </div>
    );
};

export default ClientWrapper;
