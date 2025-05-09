import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import React from "react";

interface ChildProps {
    principalData: number[];
}

const LossOfInterestTable: React.FC<ChildProps> = ({ principalData }) => {

    const years: number[] = [];
    const currentDate = new Date()
    for (let i = 0; i < 12; i++) {
        years.push(Number(currentDate.getFullYear()) + i)
    }
    
    const annualReturnRate = 6.02

    const computeColTotals = (colID: number) => {
        let sum = 0;
        principalData.forEach((item, rowID) => {
            if (colID >= rowID) {
                sum += (item*(Math.pow(1+annualReturnRate/100, colID-rowID+1)) - item)
            }
        })
        return sum;
    }

    const convertIncomingToChart = () => {
        const cleanedDataArray = []
        for (let i = 0; i < 12; i++) {
            cleanedDataArray.push({
                name: Number(currentDate.getFullYear()) + i,
                principal: principalData[i],
                loss_of_interest: computeColTotals(i)
            })
        }
        return cleanedDataArray
    }

    console.log(principalData)

    return(
        <>
            <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Loss of Interest table</div>
            <Tabs defaultValue="table" className="w-full h-auto">
                <div className="flex">
                    <p className="text-lg mt-auto mb-auto">Show as:</p>
                    <TabsList className="grid w-1/5 h-auto grid-cols-2 text-base ml-4">
                        <TabsTrigger value="table" className="text-base text-balance text-2xl">Table</TabsTrigger>
                        <TabsTrigger value="chart" className="text-base text-balance text-2xl">Chart</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="table">
                    {/* display the table */}
                    <Table>
                        <TableHeader>

                            {/* row(s) for table headers */}
                            <TableRow className="text-base">
                                <TableHead>Year</TableHead>
                                {years.map((item, index) => (
                                    <TableHead className="text-center font-bold text-black-900" key={index}>{item}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        
                        <TableBody>
                            {/* row(s) for other headers */}
                            <TableRow className="text-base">
                                <TableHead className="w-10 text-amber-900">Principal</TableHead>
                                {years.map((item, index) => (
                                    <TableHead className="text-center font-bold text-sm text-amber-900" key={index}>${principalData[index].toFixed(0)}</TableHead>
                                ))}
                            </TableRow>
                            <TableRow className="text-base">
                                <TableHead className="text-amber-900">Annual Return Rate</TableHead>
                                {years.map((item, index) => (
                                    <TableHead className="text-center font-bold text-sm text-amber-900" key={index}>{annualReturnRate}%</TableHead>
                                ))}
                            </TableRow>

                            {/* row(s) for interests lost */}
                            {/* <p>{principalData.toString()}</p> */}
                            {principalData.map((item, index) => (
                                ((index < years.length) && (
                                <TableRow key={index}>
                                    {/* Create a row */}
                                    <TableCell className="text-amber-900 font-bold text-sm">${(item).toFixed(0)}</TableCell>
                                    {principalData.map((colItem, colIndex) => (
                                        ((colIndex < years.length) && (
                                            ((colIndex >= index) ? 
                                                <TableCell key={colIndex} className="text-xs text-center">
                                                    ${(item*(Math.pow(1+annualReturnRate/100, colIndex-index+1)) - item).toFixed(0)}
                                                </TableCell> : <TableCell key={colIndex}></TableCell>
                                            )
                                        ))
                                    ))}
                                </TableRow>))       
                            ))}

                            {/* last row for total interests lost. wrap in TableHeader to get bold effect*/}
                            <TableRow className="text-red-600">
                                <TableCell className="text-base">Total Interest Lost</TableCell>
                                {principalData.map((item, index) => (
                                    ((index < years.length) && (
                                        <TableCell className="text-center text-sm font-bold" key={index}>${computeColTotals(index).toFixed(0)}</TableCell>
                                    ))
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="chart">
                    <p className="text-2xl text-center pb-[1%]">Principal & Loss of Interest [yearly]</p>
                    <ResponsiveContainer width = "95%" height={window.innerHeight *0.5}>
                        
                        <LineChart  data={convertIncomingToChart()} margin={{ top: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="6 6" />
                            <XAxis dataKey="name" />
                            <YAxis orientation="left"/>
                            <Tooltip separator=": $"/>
                            <Legend />
                            <Line type="monotone" dataKey="principal" stroke="goldenrod" strokeWidth={3}/>
                            <Line type="monotone" dataKey="loss_of_interest" stroke="red" strokeWidth={3}/>
                        </LineChart>

                    </ResponsiveContainer>
                    

                </TabsContent>
            </Tabs>
        </>
        
    )
}

export default LossOfInterestTable;
