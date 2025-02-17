'use client';

import { BalanceSheet, FinancialReport, IncomeStatement } from "@/lib/fetch";
import { useEffect, useReducer } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

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
    | { type: 'SET_FINANCIALS'; data: FinancialReport };

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
        }
    }, []);

    const handleIncomeChange = (field: keyof IncomeStatement, value: string) => {
        const PARSED_VALUE = value.trim().length > 0 ? parseFloat(value) : null;
        dispatchFinancials({ type: 'UPDATE_INCOME', field, value: PARSED_VALUE });
    };

    const handleBalanceChange = (field: keyof BalanceSheet, value: string) => {
        const PARSED_VALUE = value.trim().length > 0 ? parseFloat(value) : null;
        dispatchFinancials({ type: 'UPDATE_BALANCE', field, value: PARSED_VALUE });
    };

    return (
        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <Tabs defaultValue="income">
                <TabsList className="grid grid-cols-2 w-[400px] mb-4">
                    <TabsTrigger value="income">Income Statement</TabsTrigger>
                    <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
                </TabsList>
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
                                    <Input
                                        value={financials.income.revenue ?? ""}
                                        onChange={(e) => handleIncomeChange("revenue", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Cost of Contracting</Label>
                                    <Input
                                        value={financials.income.contractingCost ?? ""}
                                        onChange={(e) => handleIncomeChange("contractingCost", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Overhead</Label>
                                    <Input
                                        value={financials.income.overhead ?? ""}
                                        onChange={(e) => handleIncomeChange("overhead", e.target.value)}
                                    />
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
                                    <Input
                                        value={financials.income.salary ?? ""}
                                        onChange={(e) => handleIncomeChange("salary", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Rent and Overhead</Label>
                                    <Input
                                        value={financials.income.rent ?? ""}
                                        onChange={(e) => handleIncomeChange("rent", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Depreciation and Amortization</Label>
                                    <Input
                                        value={financials.income.depreciation ?? ""}
                                        onChange={(e) => handleIncomeChange("depreciation", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Interest</Label>
                                    <Input
                                        value={financials.income.operatingInterest ?? ""}
                                        onChange={(e) => handleIncomeChange("operatingInterest", e.target.value)}
                                    />
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
                                    <Input
                                        value={financials.income.interestIncome ?? ""}
                                        onChange={(e) => handleIncomeChange("interestIncome", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Interest Expense</Label>
                                    <Input
                                        value={financials.income.interestExpense ?? ""}
                                        onChange={(e) => handleIncomeChange("interestExpense", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Gain (Loss) on Disposal of Assets</Label>
                                    <Input
                                        value={financials.income.assetGain ?? ""}
                                        onChange={(e) => handleIncomeChange("assetGain", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Other Income (Expense)</Label>
                                    <Input
                                        value={financials.income.otherIncome ?? ""}
                                        onChange={(e) => handleIncomeChange("otherIncome", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Income Taxes</Label>
                                    <Input
                                        value={financials.income.incomeTax ?? ""}
                                        onChange={(e) => handleIncomeChange("incomeTax", e.target.value)}
                                    />
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
                                    <Input
                                        value={financials.balance.cash ?? ""}
                                        onChange={(e) => handleBalanceChange("cash", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Accounts Receivable</Label>
                                    <Input
                                        value={financials.balance.accountReceivable ?? ""}
                                        onChange={(e) => handleBalanceChange("accountReceivable", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Inventory</Label>
                                    <Input
                                        value={financials.balance.inventory ?? ""}
                                        onChange={(e) => handleBalanceChange("inventory", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Property, Plant, and Equipment</Label>
                                    <Input
                                        value={financials.balance.longTermProperty ?? ""}
                                        onChange={(e) => handleBalanceChange("longTermProperty", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Investment</Label>
                                    <Input
                                        value={financials.balance.longTermAsset ?? ""}
                                        onChange={(e) => handleBalanceChange("longTermAsset", e.target.value)}
                                    />
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
                                    <Input
                                        value={financials.balance.accountPayable ?? ""}
                                        onChange={(e) => handleBalanceChange("accountPayable", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Current Debt Service</Label>
                                    <Input
                                        value={financials.balance.currentDebtService ?? ""}
                                        onChange={(e) => handleBalanceChange("currentDebtService", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Taxes Payable</Label>
                                    <Input
                                        value={financials.balance.taxPayable ?? ""}
                                        onChange={(e) => handleBalanceChange("taxPayable", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Long-term Debt Service</Label>
                                    <Input
                                        value={financials.balance.longTermDebtService ?? ""}
                                        onChange={(e) => handleBalanceChange("longTermDebtService", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Loans Payable</Label>
                                    <Input
                                        value={financials.balance.loanPayable ?? ""}
                                        onChange={(e) => handleBalanceChange("loanPayable", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Equity Capital</Label>
                                    <Input
                                        value={financials.balance.equityCapital ?? ""}
                                        onChange={(e) => handleBalanceChange("equityCapital", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Retained Earnings</Label>
                                    <Input
                                        value={financials.balance.retainedEarning ?? ""}
                                        onChange={(e) => handleBalanceChange("retainedEarning", e.target.value)}
                                    />
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
