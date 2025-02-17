import { sql } from "@vercel/postgres";

export type BalanceSheet = {
    id: number | null;
    year: number | null;
    cash: number | null;
    accountReceivable: number | null;
    inventory: number | null;
    longTermProperty: number | null;
    longTermAsset: number | null;
    accountPayable: number | null;
    currentDebtService: number | null;
    taxPayable: number | null;
    longTermDebtService: number | null;
    loanPayable: number | null;
    equityCapital: number | null;
    retainedEarning: number | null;
};

export type IncomeStatement = {
    id: number | null;
    year: number | null;
    revenue: number | null;
    contractingCost: number | null;
    overhead: number | null;
    salary: number | null;
    rent: number | null;
    depreciation: number | null;
    operatingInterest: number | null;
    interestIncome: number | null;
    interestExpense: number | null;
    assetGain: number | null;
    otherIncome: number | null;
    incomeTax: number | null;
};

export type FinancialReport = {
    balance: BalanceSheet;
    income: IncomeStatement;
};

export const fetchFinancials = async (): Promise<Record<number, FinancialReport>> => {
    const BALANCE_QUERY = `SELECT * FROM "BalanceSheets" ORDER BY year DESC;`;
    const INCOME_QUERY = `SELECT * FROM "IncomeStatements" ORDER BY year DESC;`;

    const [BALANCE_RESULT, INCOME_RESULT] = await Promise.all([
        sql.query(BALANCE_QUERY),
        sql.query(INCOME_QUERY)
    ]);

    const FINANCIALS: Record<number, FinancialReport> = {};

    BALANCE_RESULT.rows.forEach(row => {
        if (!FINANCIALS[row.year]) FINANCIALS[row.year] = {} as FinancialReport;
        FINANCIALS[row.year].balance = row;
    });

    INCOME_RESULT.rows.forEach(row => {
        if (!FINANCIALS[row.year]) FINANCIALS[row.year] = {} as FinancialReport;
        FINANCIALS[row.year].income = row;
    });

    return FINANCIALS;
};
