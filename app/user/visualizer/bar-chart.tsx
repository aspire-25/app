"use client"

import { Settings2, BarChart2, LineChart as LineChartIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FlattenedFinancialReport } from "@/lib/fetch"
import { getColumnLabel } from "@/lib/financials"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"


function textToHSL(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = Math.abs(hash) % 360;
    const s = 70;
    const l = 50;

    return `hsl(${h}, ${s}%, ${l}%)`;
}

const getChartConfig = (field: string): ChartConfig => {
    return {
        [field]: {
            label: getColumnLabel(field),
            color: textToHSL(field),
        }
    }
}

const getChartConfigGroup = (fields: string[]): ChartConfig => {
    return fields.reduce((config, field) => {
        return { ...config, ...getChartConfig(field) };
    }, {});
};

const Chart = ({ data }: { data: FlattenedFinancialReport[] }) => {
    const [currentFields, setCurrentFields] = useState<string[]>([]);
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

    const cleanData = (data: FlattenedFinancialReport[]) => {
        return data.map((entry) =>
            Object.fromEntries(
                Object.entries(entry).map(([key, value]) => [
                    key,
                    typeof value === "string" && value.includes("%")
                        ? parseFloat(value.replace("%", ""))
                        : value,
                ])
            )
        );
    }

    const getYearRange = (data: FlattenedFinancialReport[]) => {
        const years = data.map((entry) => entry.year).filter(Boolean);
        const minYear = Math.min(...years.map(year => Number(year)));
        const maxYear = Math.max(...years.map(year => Number(year)));
        return minYear === maxYear ? `${minYear}` : `${minYear} - ${maxYear}`;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Financials Visualized</CardTitle>
                <CardDescription>{getYearRange(data)}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={getChartConfigGroup(currentFields)}>
                    {chartType === 'bar' ? (
                        <BarChart accessibilityLayer data={cleanData(data)}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="year"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                width={50}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            {
                                currentFields.map((field: string) => (
                                    <Bar dataKey={field} fill={textToHSL(field)} radius={4} key={field} />
                                ))
                            }
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    ) : (
                        <LineChart accessibilityLayer data={cleanData(data)}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="year"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                width={50}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            {
                                currentFields.map((field: string) => (
                                    <Line
                                        type="monotone"
                                        dataKey={field}
                                        stroke={textToHSL(field)}
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        key={field}
                                    />
                                ))
                            }
                            <ChartLegend content={<ChartLegendContent />} />
                        </LineChart>
                    )}
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <Button
                        variant={chartType === 'bar' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setChartType('bar')}
                    >
                        <BarChart2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={chartType === 'line' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setChartType('line')}
                    >
                        <LineChartIcon className="h-4 w-4" />
                    </Button>
                </div>
                <div className="ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline">
                                <Settings2 />
                                Select Field
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Toggle fields</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <ScrollArea className="h-72">
                                {
                                    Object.keys(data[0]).filter(field => field !== 'year').map((field) => (
                                        <DropdownMenuCheckboxItem
                                            key={field}
                                            checked={currentFields.includes(field)}
                                            onCheckedChange={(checked) => {
                                                setCurrentFields((prevFields: string[]) =>
                                                    checked
                                                        ? [...prevFields, field]
                                                        : prevFields.filter((f) => f !== field)
                                                );
                                            }}
                                        >
                                            {getColumnLabel(field)}
                                        </DropdownMenuCheckboxItem>

                                    ))
                                }
                            </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardFooter>
        </Card>
    )
}

export default Chart;
