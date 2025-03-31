'use server';

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export type AppUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateJoined: string;
    role: string;
    active: boolean;
}

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

export type FinancialReportCollection = {
    [year: string]: FinancialReport;
}

export type CalculatedFinancialReport = {
    balance: CalculatedBalanceSheet;
    income: CalculatedIncomeStatement;
}

export type CalculatedFinancialReportCollection = {
    [year: string]: CalculatedFinancialReport;
};

export type FlattenedFinancialReport = {
    year: string;
} & CalculatedBalanceSheet & CalculatedIncomeStatement;

export type CalculatedBalanceSheet = {
    totalCurrentAssets: number;
    totalLongTermAssets: number;
    totalAssets: number;
    totalCurrentLiabilities: number;
    totalLongTermLiabilities: number;
    totalLiabilities: number;
    totalStockholdersEquity: number;
    totalLiabilitiesAndEquity: number;
}

export type CalculatedIncomeStatement = {
    netSales: number;
    costOfGoodsSold: number;
    grossProfit: number;
    grossMargin: string;
    totalOperatingExpenses: number;
    operatingExpenses: string;
    profitFromOperations: number;
    profitFromOperationsMargin: string;
    totalOtherIncome: number;
    totalOtherIncomeMargin: string;
    incomeBeforeTax: number;
    incomeBeforeTaxMargin: string;
    netIncome: number;
    netIncomeMargin: string;
}

export type TransformedFinancialReportCollection = {
    balance: TransformedBalanceSheetCollection;
    income: TransformedIncomeStatementCollection;
};
export type TransformedBalanceSheetCollection = {
    [K in keyof CalculatedBalanceSheet]: 
        CalculatedBalanceSheet[K] extends number ? number[] : string[];
};

export type TransformedIncomeStatementCollection = {
    [K in keyof CalculatedIncomeStatement]: 
        CalculatedIncomeStatement[K] extends number ? number[] : string[];
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

export const updateFinancials = async (data: FinancialReport) => {
    try {
        const YEAR_EXIST = await sql.query(`SELECT * FROM "BalanceSheets" WHERE year = ${data.income.year};`);

        if (YEAR_EXIST.rowCount === 0) {
            const INSERT_BALANCE_QUERY = `
                INSERT INTO "BalanceSheets" 
                (year, cash, "accountReceivable", inventory, "longTermProperty", "longTermAsset", 
                "accountPayable", "currentDebtService", "taxPayable", "longTermDebtService", 
                "loanPayable", "equityCapital", "retainedEarning")
                VALUES 
                (${data.balance.year}, ${data.balance.cash}, ${data.balance.accountReceivable}, ${data.balance.inventory}, 
                ${data.balance.longTermProperty}, ${data.balance.longTermAsset}, 
                ${data.balance.accountPayable}, ${data.balance.currentDebtService}, 
                ${data.balance.taxPayable}, ${data.balance.longTermDebtService}, 
                ${data.balance.loanPayable}, ${data.balance.equityCapital}, 
                ${data.balance.retainedEarning});
            `;

            const INSERT_INCOME_QUERY = `
                INSERT INTO "IncomeStatements" 
                (year, revenue, "contractingCost", overhead, salary, rent, depreciation, 
                "operatingInterest", "interestIncome", "interestExpense", "assetGain", "otherIncome", "incomeTax")
                VALUES 
                (${data.income.year}, ${data.income.revenue}, ${data.income.contractingCost}, ${data.income.overhead}, 
                ${data.income.salary}, ${data.income.rent}, ${data.income.depreciation}, 
                ${data.income.operatingInterest}, ${data.income.interestIncome}, 
                ${data.income.interestExpense}, ${data.income.assetGain}, 
                ${data.income.otherIncome}, ${data.income.incomeTax});
            `;

            await sql.query(INSERT_BALANCE_QUERY);
            await sql.query(INSERT_INCOME_QUERY);
        } else {
            const UPDATE_BALANCE_QUERY = `
                UPDATE "BalanceSheets"
                SET cash = ${data.balance.cash},
                    "accountReceivable" = ${data.balance.accountReceivable},
                    inventory = ${data.balance.inventory},
                    "longTermProperty" = ${data.balance.longTermProperty},
                    "longTermAsset" = ${data.balance.longTermAsset},
                    "accountPayable" = ${data.balance.accountPayable},
                    "currentDebtService" = ${data.balance.currentDebtService},
                    "taxPayable" = ${data.balance.taxPayable},
                    "longTermDebtService" = ${data.balance.longTermDebtService},
                    "loanPayable" = ${data.balance.loanPayable},
                    "equityCapital" = ${data.balance.equityCapital},
                    "retainedEarning" = ${data.balance.retainedEarning}
                WHERE year = ${data.balance.year};
            `;

            const UPDATE_INCOME_QUERY = `
                UPDATE "IncomeStatements"
                SET revenue = ${data.income.revenue},
                    "contractingCost" = ${data.income.contractingCost},
                    overhead = ${data.income.overhead},
                    salary = ${data.income.salary},
                    rent = ${data.income.rent},
                    depreciation = ${data.income.depreciation},
                    "operatingInterest" = ${data.income.operatingInterest},
                    "interestIncome" = ${data.income.interestIncome},
                    "interestExpense" = ${data.income.interestExpense},
                    "assetGain" = ${data.income.assetGain},
                    "otherIncome" = ${data.income.otherIncome},
                    "incomeTax" = ${data.income.incomeTax}
                WHERE year = ${data.income.year};
            `;

            await sql.query(UPDATE_BALANCE_QUERY);
            await sql.query(UPDATE_INCOME_QUERY);
        }
    } catch (error) {
        console.error("Error updating financials:", error);
        throw new Error("Failed to update financials");
    }
};

export const deleteFinancials = async (year: number) => {
    const DELETE_BALANCE_QUERY = `DELETE FROM "BalanceSheets" WHERE year = ${year};`;
    const DELETE_INCOME_QUERY = `DELETE FROM "IncomeStatements" WHERE year = ${year};`;
    await sql.query(DELETE_BALANCE_QUERY);
    await sql.query(DELETE_INCOME_QUERY);
}

export const fetchUsers = async () => {
    const QUERY = `SELECT * FROM "Users";`;
    const RESULT = await sql.query(QUERY);
    return RESULT.rows;
}

export const toggleUserActive = async (id: number, active: boolean) => {
    const QUERY = `UPDATE "Users" SET active = ${active} WHERE id = ${id};`;
    await sql.query(QUERY);
    revalidatePath('/user/manage-user');
}

export const updateRole = async (id: number, role: string) => {
    const QUERY = `UPDATE "Users" SET role = '${role}' WHERE id = ${id};`;
    await sql.query(QUERY);
    revalidatePath('/user/manage-user');
}
