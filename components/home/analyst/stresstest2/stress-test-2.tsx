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

let years: number[] = [];
const currentDate = new Date()
for (let i = 0; i < 12; i++) {
    years.push(Number(currentDate.getFullYear()) + i)
}

const StressTest2 = () => {
    const [decreaseInRevenues, setDecreaseInRevenues] = useState(2.25)
    const [st1Output, setSt1Output] = useState<number[]>([153034, 155329, 157659, 160024, 162424, 164861, 167334, 169844, 172391, 174977, 177602, 180266])

    return (
        <>

            {/* inputs for ST 2 */}
            <Label htmlFor="term" className="mb-1">% Decrease in Revenue</Label>
                <div className="w-1/5 flex">
                    <Input type="number" id="term" placeholder="Enter in %" className="text-lg mb-3" value={decreaseInRevenues} name="term" onChange={(e) => (setDecreaseInRevenues(Number(e.target.value)))}/>
                    <Button type="submit"  className="bg-cyan-900">Save</Button>
                </div>

            {/* summary table */}
            <p className="font-bold text-indigo-600 text-2xl">⚠️ As of 3/11, these are dummy values. They are NOT linked to the FC page.</p><br/>
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

            <TableDivider/>
            <p className="font-bold text-red-600 text-2xl"> ⚠️ Ask: is the difference in formula for cell O47 for Stress Test 2 intentional?</p><br></br>
            <LossOfInterestTable principalData={st1Output.map(e => e*(decreaseInRevenues/100))}/>

        </>
    )
}

export default StressTest2