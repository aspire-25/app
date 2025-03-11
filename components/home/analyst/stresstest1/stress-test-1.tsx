import StressTestInputs from "./stress-tests-inputs"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

let years: number[] = [];
const currentDate = new Date()
for (let i = 0; i < 12; i++) {
    years.push(Number(currentDate.getFullYear()) + i)
}

let annualReturnRate = 6.02

console.log(years)

const StressTest1 = () => {
    const [st1Output, setSt1Output] = useState<number[]>([])
    const [st2Output, setSt2Output] = useState<number[]>([])
    const [stDiffs, setStDiffs] = useState<number[]>(() => {
    let lst: number[] = [];
        years.forEach((yr) => {
            lst.push(0);
        })
        return lst
    })
    
    const sendToParent = (data: Array<number>) => {
        // console.log(data)
        setSt1Output(data)

        if (st2Output.length > 0) {
            let diff = data.map(function(item, index) {
                return st2Output[index] - item
            })
            setStDiffs(diff)
        }
    }

    const sendToParent2 = (data: Array<number>) => {
        // console.log(data)
        setSt2Output(data)

        if (st1Output.length > 0) {
            const diff = data.map(function(item, index) {
                return item - st1Output[index] 
            })
            setStDiffs(diff)
        }
    }

    const computeColTotals = (colID: number) => {
        let sum = 0;
        stDiffs.forEach((item, rowID) => {
            if (colID >= rowID) {
                sum += (item*(Math.pow(1+annualReturnRate/100, colID-rowID+1)) - item)
            }
        })
        return sum;
    }

    return (
        <>

            {/* inputs for ST 1 */}
            <StressTestInputs onParamsUpdate={sendToParent}/>
            <div style={{backgroundColor: "lightgray", height: "1vh", width: "100%", margin: "5% auto 5% auto"}}></div>
            <StressTestInputs onParamsUpdate={sendToParent2}/>
            <div style={{backgroundColor: "lightgray", height: "1vh", width: "100%", margin: "5% auto 5% auto"}}></div>

            {/* summary table */}
            <Table>
                <TableHeader>
                    <TableRow className="text-base">
                        <TableHead className="text-center">Year</TableHead>
                        <TableHead className="text-center">🔽 in revenues</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {years.map((item, index) => (
                    <TableRow key={item} className="text-sm text-center">
                        <TableCell>{item}</TableCell>
                        <TableCell className="font-bold text-amber-900">${stDiffs[index].toFixed(0)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div style={{backgroundColor: "lightgray", height: "1vh", width: "100%", margin: "5% auto 5% auto"}}></div>

            {/* loss of interests table */}
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
                            <TableHead className="text-center font-bold text-sm text-amber-900" key={index}>${stDiffs[index].toFixed(0)}</TableHead>
                        ))}
                    </TableRow>
                    <TableRow className="text-base">
                        <TableHead className="text-amber-900">Annual Return Rate</TableHead>
                        {years.map((item, index) => (
                            <TableHead className="text-center font-bold text-sm text-amber-900" key={index}>{annualReturnRate}%</TableHead>
                        ))}
                    </TableRow>

                    {/* row(s) for interests lost */}
                    {/* <p>{stDiffs.toString()}</p> */}
                    {stDiffs.map((item, index) => (
                        ((index < years.length) && (
                        <TableRow key={index}>
                            {/* Create a row */}
                            <TableCell className="text-amber-900 font-bold text-sm">${(item).toFixed(0)}</TableCell>
                            {stDiffs.map((colItem, colIndex) => (
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
                        <TableRow className="text-red-900">
                            <TableCell className="text-base">Total Interest Lost</TableCell>
                            {stDiffs.map((item, index) => (
                                ((index < years.length) && (
                                    <TableCell className="text-center text-sm font-bold" key={index}>${computeColTotals(index).toFixed(0)}</TableCell>
                                ))
                            ))}
                        </TableRow>
                        
                    </TableBody>
            </Table>
        </>
    )
}

export default StressTest1