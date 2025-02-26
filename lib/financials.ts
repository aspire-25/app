import { BalanceSheet, CalculatedBalanceSheet, CalculatedFinancialReportCollection, CalculatedIncomeStatement, IncomeStatement, TransformedFinancialReportCollection } from "./fetch";

export const calculateBalanceSheet = (data: BalanceSheet): CalculatedBalanceSheet => {
    const TOTAL_CURRENT_ASSETS = (data.cash || 0) + (data.accountReceivable || 0) + (data.inventory || 0);
    const TOTAL_LONG_TERM_ASSETS = (data.longTermProperty || 0) + (data.longTermAsset || 0);
    const TOTAL_ASSETS = TOTAL_CURRENT_ASSETS + TOTAL_LONG_TERM_ASSETS;
    const TOTAL_CURRENT_LIABILITIES = (data.accountPayable || 0) + (data.currentDebtService || 0) + (data.taxPayable || 0);
    const TOTAL_LONG_TERM_LIABILITIES = (data.longTermDebtService || 0) + (data.loanPayable || 0);
    const TOTAL_LIABILITIES = TOTAL_CURRENT_LIABILITIES + TOTAL_LONG_TERM_LIABILITIES;
    const TOTAL_STOCKHOLDERS_EQUITY = (data.equityCapital || 0) + (data.retainedEarning || 0);
    const TOTAL_LIABILITIES_AND_EQUITY = TOTAL_LIABILITIES + TOTAL_STOCKHOLDERS_EQUITY;
    return {
        totalCurrentAssets: TOTAL_CURRENT_ASSETS,
        totalLongTermAssets: TOTAL_LONG_TERM_ASSETS,
        totalAssets: TOTAL_ASSETS,
        totalCurrentLiabilities: TOTAL_CURRENT_LIABILITIES,
        totalLongTermLiabilities: TOTAL_LONG_TERM_LIABILITIES,
        totalLiabilities: TOTAL_LIABILITIES,
        totalStockholdersEquity: TOTAL_STOCKHOLDERS_EQUITY,
        totalLiabilitiesAndEquity: TOTAL_LIABILITIES_AND_EQUITY
    }
};

export const calculateIncomeStatement = (data: IncomeStatement): CalculatedIncomeStatement => {
    const NET_SALES = data.revenue || 0;
    const COST_OF_GOODS_SOLD = (data.contractingCost || 0) + (data.overhead || 0);
    const GROSS_PROFIT = NET_SALES - COST_OF_GOODS_SOLD;
    const GROSS_MARGIN = `${((GROSS_PROFIT / NET_SALES) * 100).toFixed(2)}%`;
    const TOTAL_OPERATING_EXPENSES = (data.salary || 0) + (data.rent || 0) + (data.depreciation || 0) + (data.operatingInterest || 0);
    const OPERATING_EXPENSES = `${((TOTAL_OPERATING_EXPENSES / NET_SALES) * 100).toFixed(2)}%`;
    const PROFIT_FROM_OPERATIONS = GROSS_PROFIT - TOTAL_OPERATING_EXPENSES;
    const PROFIT_FROM_OPERATIONS_MARGIN = `${((PROFIT_FROM_OPERATIONS / NET_SALES) * 100).toFixed(2)}%`;
    const TOTAL_OTHER_INCOME = (data.interestIncome || 0) - (data.interestExpense || 0) + (data.assetGain || 0) + (data.otherIncome || 0);
    const TOTAL_OTHER_INCOME_MARGIN = `${((TOTAL_OTHER_INCOME / NET_SALES) * 100).toFixed(2)}%`;
    const INCOME_BEFORE_TAX = PROFIT_FROM_OPERATIONS + TOTAL_OTHER_INCOME;
    const INCOME_BEFORE_TAX_MARGIN = `${((INCOME_BEFORE_TAX / NET_SALES) * 100).toFixed(2)}%`;
    const NET_INCOME = INCOME_BEFORE_TAX - (data.incomeTax || 0);
    const NET_INCOME_MARGIN = `${((NET_INCOME / NET_SALES) * 100).toFixed(2)}%`;
    return {
        netSales: NET_SALES,
        costOfGoodsSold: COST_OF_GOODS_SOLD,
        grossProfit: GROSS_PROFIT,
        grossMargin: GROSS_MARGIN,
        totalOperatingExpenses: TOTAL_OPERATING_EXPENSES,
        operatingExpenses: OPERATING_EXPENSES,
        profitFromOperations: PROFIT_FROM_OPERATIONS,
        profitFromOperationsMargin: PROFIT_FROM_OPERATIONS_MARGIN,
        totalOtherIncome: TOTAL_OTHER_INCOME,
        totalOtherIncomeMargin: TOTAL_OTHER_INCOME_MARGIN,
        incomeBeforeTax: INCOME_BEFORE_TAX,
        incomeBeforeTaxMargin: INCOME_BEFORE_TAX_MARGIN,
        netIncome: NET_INCOME,
        netIncomeMargin: NET_INCOME_MARGIN
    }
};

export const getColumnLabel = (key: string) => {
    switch (key) {
        case 'year': return "Year";
        case 'cash': return "Cash and Cash Equivalents";
        case 'accountReceivable': return "Account Receivable";
        case 'inventory': return "Inventory";
        case 'totalCurrentAssets': return "Total Current Assets";
        case 'longTermProperty': return "Property, Plant, and Equipment";
        case 'longTermAsset': return "Investments";
        case 'totalLongTermAssets': return "Total Long-Term Assets";
        case 'totalAssets': return "Total Assets";
        case 'accountPayable': return "Account Payable";
        case 'currentDebtService': return "Debt Service";
        case 'taxPayable': return "Taxes Payable";
        case 'totalCurrentLiabilities': return "Total Current Liabilities";
        case 'longTermDebtService': return "Debt Service";
        case 'loanPayable': return "Loans Payable";
        case 'totalLongTermLiabilities': return "Total Long-Term Liabilities";
        case 'totalLiabilities': return "Total Liabilities";
        case 'equityCapital': return "Equity Capital";
        case 'retainedEarning': return "Retained Earnings";
        case 'totalStockholdersEquity': return "Total Stockholders' Equity";
        case 'totalLiabilitiesAndEquity': return "Total Liabilities and Equity";
        case 'revenue': return "Revenue";
        case 'netSales': return "Net Sales";
        case 'contractingCost': return "Cost of Contracting";
        case 'overhead': return "Overhead";
        case 'costOfGoodsSold': return "Cost of Goods Sold";
        case 'grossProfit': return "Gross Profit";
        case 'grossMargin': return "Gross Margin %";
        case 'salary': return "Salaries and Benefits";
        case 'rent': return "Rent and Overhead";
        case 'depreciation': return "Depreciation and Amortization";
        case 'operatingInterest': return "Interest";
        case 'totalOperatingExpenses': return "Total Operating Expenses";
        case 'operatingExpenses': return "Operating Expenses %";
        case 'profitFromOperations': return "Profit (Loss) from Operations";
        case 'profitFromOperationsMargin': return "Profit (Loss) from Operations %";
        case 'interestIncome': return "Interest Income";
        case 'interestExpense': return "Interest Expense";
        case 'assetGain': return "Gain (Loss) on Disposal of Assets";
        case 'otherIncome': return "Other Income (Expense)";
        case 'totalOtherIncome': return "Total Other Income (Expense)";
        case 'totalOtherIncomeMargin': return "Total Other Income (Expense) %";
        case 'incomeBeforeTax': return "Income (Loss) Before Income Taxes";
        case 'incomeBeforeTaxMargin': return "Income (Loss) Before Income Tax %";
        case 'incomeTax': return "Income Taxes";
        case 'netIncome': return "Net Income (Loss)";
        case 'netIncomeMargin': return "Net Income (Loss) %";
        default: return "Unknown Column";
    }
};

export const transformCalculatedFinancialReportCollection = (reports: CalculatedFinancialReportCollection): TransformedFinancialReportCollection => {
    const TRANSFORMED = {} as TransformedFinancialReportCollection;

    Object.values(reports).forEach((report) => {
        for (const key of Object.keys(report.balance) as Array<keyof CalculatedBalanceSheet>) {
            if (!TRANSFORMED[key]) TRANSFORMED[key] = [];
            (TRANSFORMED[key] as number[]).push(report.balance[key] as number);
        }

        for (const key of Object.keys(report.income) as Array<keyof CalculatedIncomeStatement>) {
            if (!TRANSFORMED[key]) TRANSFORMED[key] = [];
            
            if (typeof report.income[key] === "number") {
                (TRANSFORMED[key] as number[]).push(report.income[key] as number);
            } else {
                (TRANSFORMED[key] as string[]).push(report.income[key] as string);
            }
        }
    });
    return TRANSFORMED;
}
