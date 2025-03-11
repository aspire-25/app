import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

interface ChildProps {
    principalData: number[];
}

const LossOfInterestTable: React.FC<ChildProps> = ({ principalData }) => {

    let years: number[] = [];
    const currentDate = new Date()
    for (let i = 0; i < 12; i++) {
        years.push(Number(currentDate.getFullYear()) + i)
    }
    
    let annualReturnRate = 6.02

    const computeColTotals = (colID: number) => {
        let sum = 0;
        principalData.forEach((item, rowID) => {
            if (colID >= rowID) {
                sum += (item*(Math.pow(1+annualReturnRate/100, colID-rowID+1)) - item)
            }
        })
        return sum;
    }

    return(
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
    )
    
}

export default LossOfInterestTable;
