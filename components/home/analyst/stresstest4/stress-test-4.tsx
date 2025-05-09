import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import TableDivider from "../tableDivider"
import LossOfInterestTable from "../lossOfInterestTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const years: number[] = [];
const currentDate = new Date()
for (let i = 0; i < 12; i++) {
    years.push(Number(currentDate.getFullYear()) + i)
}

const StressTest4 = () => {
    const [totalOpExp] = useState<number[]>([52589, 52564, 52930, 52694, 52729, 52785, 52736, 52750, 52757, 52748, 52752, 52752])
    const [percent, setPercent] = useState(2.5)

    const turnIntoChartForm = () => {
        const arr: { year: number; totalOperatingExp: number; increase: number; forecast: number }[] = [];
        years.forEach((x, index) => {
            arr.push({year: x, totalOperatingExp: totalOpExp[index], increase: totalOpExp[index]*(percent/100), forecast: totalOpExp[index]*(1 + (percent/100))})
        })

        return arr;
    }
    
    return (
        <>

            {/* inputs for ST 4 */}
            <Label htmlFor="term" className="mb-1">Increase operating expenses by (%)</Label>
            <div className="w-1/5 flex">
                    <Input type="number" id="term" placeholder="Enter in %" className="text-lg mb-3" value={percent} name="term" onChange={(e) => (setPercent(Number(e.target.value)))}/>
                    <Button type="submit"  className="bg-cyan-900">Save</Button>
            </div>

            {/* summary table */}

            <Tabs defaultValue="table" className="w-full h-auto">
                <div className="flex">
                    <p className="text-lg mt-auto mb-auto">Show as:</p>
                    <TabsList className="grid w-1/5 h-auto grid-cols-2 text-base ml-4">
                        <TabsTrigger value="table" className="text-base text-balance text-2xl">Table</TabsTrigger>
                        <TabsTrigger value="chart" className="text-base text-balance text-2xl">Chart</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="table">
                    <div className="w-1/2">
                        <Table>
                            <TableHeader>
                                <TableRow className="text-base">
                                    <TableHead className="text-center font-bold">Year</TableHead>
                                    <TableHead className="text-center">Total Operating Expenses</TableHead>
                                    <TableHead className="text-center">Increase</TableHead>
                                    <TableHead className="text-center">Forecast</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {years.map((item, index) => (
                                <TableRow key={item} className="text-sm text-center">
                                    <TableCell className="text-base font-bold">{item}</TableCell>
                                    <TableCell>${totalOpExp[index].toFixed(2)}</TableCell>
                                    <TableCell className="font-bold text-amber-900">${(totalOpExp[index]*(percent/100)).toFixed(2)}</TableCell>
                                    <TableCell className="font-bold text-indigo-900">${(totalOpExp[index]*(1+(percent/100))).toFixed(2)}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="chart">
                    <ResponsiveContainer width = "95%" height={window.innerHeight *0.5}>
                        <LineChart data={turnIntoChartForm()} margin={{ top: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="6 6" />
                            <XAxis dataKey="year" />
                            <YAxis orientation="left"/>
                            <Tooltip separator=": $"/>
                            <Legend />
                            <Line type="monotone" dataKey="totalOperatingExp" stroke="black" strokeWidth={2}/>
                            <Line type="monotone" dataKey="increase" stroke="goldenrod" strokeWidth={2}/>
                            <Line type="monotone" dataKey="forecast" stroke="blue" strokeWidth={2}/>
                        </LineChart>
                    </ResponsiveContainer>
                </TabsContent>
            </Tabs>
            
            {/* loss of interest table */}
            <TableDivider/>
            <LossOfInterestTable principalData={totalOpExp.map((item) => (item*(percent/100)))}/>
        </>
    )
}

export default StressTest4