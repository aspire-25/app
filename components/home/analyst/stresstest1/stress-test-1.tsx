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

console.log(years)

const StressTest1 = () => {
    const [st1Output, setSt1Output] = useState<number[]>([])
    const [st2Output, setSt2Output] = useState<number[]>([])
    

    const sendToParent = (data: Array<number>) => {
        // console.log(data)
        setSt1Output(data)
    }

    const sendToParent2 = (data: Array<number>) => {
        // console.log(data)
        setSt2Output(data)
    }

    return (
        <>
            <StressTestInputs onParamsUpdate={sendToParent}/>
            <div style={{backgroundColor: "lightgray", height: "1vh", width: "100%", margin: "5% auto 5% auto"}}></div>
            <StressTestInputs onParamsUpdate={sendToParent2}/>
            <div style={{backgroundColor: "lightgray", height: "1vh", width: "100%", margin: "5% auto 5% auto"}}></div>
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
                        <TableCell>${(st1Output[index] - st2Output[index]).toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
       
    )
}

export default StressTest1