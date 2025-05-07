'use client';
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { FinancialReportCollection } from "@/lib/fetch";
import { getColumnLabel } from "@/lib/financials";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend
} from "recharts";

const ClientWrapper = () => {
  const [incomeStatements, setIncomeStatements] = useState<Record<string, Record<string, number>>>({});
  const [balanceSheets, setBalanceSheets] = useState<Record<string, Record<string, number>>>({});
  const [years, setYears] = useState<string[]>([]);
  const [forecastYears, setForecastYears] = useState<number | "">(
    5
  );
  const [forecastTypes, setForecastTypes] = useState<{ [key: string]: 'average' | 'multiplier' }>({});
  const [multipliers, setMultipliers] = useState<{ [key: string]: number }>({});
  const [showChartView, setShowChartView] = useState(false);

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

  const extendedYears = [...years];
  const latestYear = parseInt(years[years.length - 1], 10);
  const numForecasts = typeof forecastYears === "number" ? forecastYears : 0;

  for (let i = 0; i < numForecasts; i++) {
    extendedYears.push((latestYear + 1 + i).toString());
  }

  const buildForecastedData = (data: Record<string, Record<string, number>>) => {
    const chartLines: { [label: string]: number[] } = {};

    const rows = Object.keys(data[years[0]] || {}).map((label) => {
      const currentForecastType = forecastTypes[label] || 'average';
      const currentMultiplier = multipliers[label] !== undefined ? multipliers[label] : 1.5;

      const existingValues = years.map(year => data[year]?.[label] ?? 0);
      const forecastedValues = [...existingValues];

      for (let i = 0; i < numForecasts; i++) {
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

      chartLines[label] = forecastedValues;

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
            ) : '1.0'}
          </TableCell>
          <TableCell>
            <div className="font-bold">{getColumnLabel(label)}</div>
          </TableCell>
          {forecastedValues.map((item, index) => (
            <TableCell key={index}>
              {typeof item === "number" ? item.toFixed(2) : "N/A"}
            </TableCell>
          ))}
        </TableRow>
      );
    });

    const chartData = extendedYears.map((year, i) => {
      const entry: Record<string, number | string> = { year: String(year) };
      Object.keys(chartLines).forEach(label => {
        entry[label] = chartLines[label][i];
      });
      return entry;
    });

    return { rows, chartData };
  };

  const renderTabContent = (dataSet: Record<string, Record<string, number>>, label: string) => {
    const { rows, chartData } = buildForecastedData(dataSet);

    return (
      <div>
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={() => setShowChartView(!showChartView)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showChartView ? 'Show Table View' : 'Show Chart View'}
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="forecastYears" className="text-sm">Forecasted Years after 2024:</label>
            <input
              id="forecastYears"
              type="number"
              min={0}
              max={20}
              step={1}
              value={forecastYears}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setForecastYears("");
                } else {
                  const num = parseInt(value, 10);
                  if (!isNaN(num) && num >= 0 && num <= 20) {
                    setForecastYears(num);
                  }
                }
              }}
              className="border px-2 py-1 rounded w-20"
            />
          </div>
        </div>

        {showChartView ? (
          <LineChart width={900} height={400} data={chartData}>
            <XAxis 
                dataKey="year" // Make sure the 'year' key matches the data structure in the chartData
                type="category" // This ensures that the x-axis is treated as categories, not numeric values
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(dataSet[years[0]] || {})
              .filter(label => label && label.trim() !== "")
              .map(label => (
                <Line
                  key={label}
                  type="monotone"
                  dataKey={label}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
          </LineChart>
        ) : (
          <Table>
            <TableCaption>{label}</TableCaption>
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
              {rows}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  return (
    <Tabs defaultValue="incomeStatement">
      <div className="flex justify-between items-center mb-5">
        <TabsList className="flex flex-row space-x-4">
          <TabsTrigger value="incomeStatement">Income Statement Forecast</TabsTrigger>
          <TabsTrigger value="balanceSheet">Balance Sheet Forecast</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="incomeStatement">
        {Object.keys(incomeStatements).length > 0 &&
          renderTabContent(incomeStatements, "Income Statement Forecast")}
      </TabsContent>

      <TabsContent value="balanceSheet">
        {Object.keys(balanceSheets).length > 0 &&
          renderTabContent(balanceSheets, "Balance Sheet Forecast")}
      </TabsContent>
    </Tabs>
  );
};

export default ClientWrapper;