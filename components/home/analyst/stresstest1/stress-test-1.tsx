import StressTestInputs from "./stress-tests-inputs"
import LossOfInterestTable from "../lossOfInterestTable";
import { useState } from "react"
import TableDivider from "../tableDivider";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const years: number[] = [];
const currentDate = new Date()
for (let i = 0; i < 12; i++) {
    years.push(Number(currentDate.getFullYear()) + i)
}


console.log(years)

const StressTest1 = () => {
    const [st1Output, setSt1Output] = useState<number[]>([])
    const [st2Output, setSt2Output] = useState<number[]>([])
    const [stDiffs, setStDiffs] = useState<number[]>(() => {
    const lst: number[] = [];
        years.forEach((yr) => {
            console.log(yr)
            lst.push(0);
        })
        return lst
    })
    
    const sendToParent = (data: Array<number>) => {
        // console.log(data)
        setSt1Output(data)

        if (st2Output.length > 0) {
            const diff = data.map(function(item, index) {
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

    return (
        <>

            {/* inputs for ST 1 */}
            <StressTestInputs onParamsUpdate={sendToParent}/>
            <TableDivider/>
            <StressTestInputs onParamsUpdate={sendToParent2}/>
            <TableDivider/>

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
            <LossOfInterestTable principalData={stDiffs}/>
        </>
    )
}

export default StressTest1