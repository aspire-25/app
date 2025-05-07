/* eslint-disable @typescript-eslint/no-unused-vars */ 
/* shut up eslint */

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TableDivider from "../tableDivider"
import LossOfInterestTable from "../lossOfInterestTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const years: number[] = [];
const currentDate = new Date()
for (let i = 0; i < 12; i++) {
    years.push(Number(currentDate.getFullYear()) + i)
}

const StressTest2 = () => {
    const [decreaseInRevenues, setDecreaseInRevenues] = useState(2.25)
    const [st1Output, setSt1Output] = useState<number[]>([153034, 155329, 157659, 160024, 162424, 164861, 167334, 169844, 172391, 174977, 177602, 180266])

    const turnIntoChartForm = () => {
        let arr: { year: number; totalRev: number; decreaseInRev: number }[] = [];
        years.forEach((x, index) => {
            arr.push({year: x, totalRev: st1Output[index], decreaseInRev: st1Output[index]*(decreaseInRevenues/100)})
        })

        return arr;
    }

    return (
        <>

            {/* inputs for ST 2 */}
            <Label htmlFor="term" className="mb-1">% Decrease in Revenue</Label>
                <div className="w-1/5 flex">
                    <Input type="number" id="term" placeholder="Enter in %" className="text-lg mb-3" value={decreaseInRevenues} name="term" onChange={(e) => (setDecreaseInRevenues(Number(e.target.value)))}/>
                    <Button type="submit"  className="bg-cyan-900">Save</Button>
                </div>

            {/* summary table */}
            <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Decrease in Revenues</div>
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
                                    <TableHead className="text-center">Year</TableHead>
                                    <TableHead className="text-center">Tot. revenues</TableHead>
                                    <TableHead className="text-center">🔽 in revenues</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {years.map((item, index) => (
                                <TableRow key={item} className="text-sm text-center">
                                    <TableCell>{item}</TableCell>
                                    <TableCell>${st1Output[index]}</TableCell>
                                    <TableCell className="font-bold text-amber-900">${(st1Output[index]*(decreaseInRevenues/100)).toFixed(0)}</TableCell>
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
                                <Line type="monotone" dataKey="totalRev" stroke="black" strokeWidth={2}/>
                                <Line type="monotone" dataKey="decreaseInRev" stroke="goldenrod" strokeWidth={2}/>
                            </LineChart>
    
                        </ResponsiveContainer>
                    </TabsContent>
            </Tabs>

            <TableDivider/>
                
            <LossOfInterestTable principalData={st1Output.map(e => e*(decreaseInRevenues/100))}/>
            
        </>
    )
}

export default StressTest2