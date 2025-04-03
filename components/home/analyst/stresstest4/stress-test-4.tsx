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

const years: number[] = [];
const currentDate = new Date()
for (let i = 0; i < 12; i++) {
    years.push(Number(currentDate.getFullYear()) + i)
}

const StressTest4 = () => {
    const [totalOpExp] = useState<number[]>([52589, 52564, 52930, 52694, 52729, 52785, 52736, 52750, 52757, 52748, 52752, 52752])
    const [percent, setPercent] = useState(2.5)
    
    return (
        <>

            {/* inputs for ST 4 */}
            <Label htmlFor="term" className="mb-1">Increase operating expenses by (%)</Label>
            <div className="w-1/5 flex">
                    <Input type="number" id="term" placeholder="Enter in %" className="text-lg mb-3" value={percent} name="term" onChange={(e) => (setPercent(Number(e.target.value)))}/>
                    <Button type="submit"  className="bg-cyan-900">Save</Button>
            </div>

            {/* summary table */}
            <p className="font-bold text-indigo-600 text-2xl">⚠️ As of 3/24, these are dummy values. They are NOT linked to the FC page.</p><br/>
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
            
            
            {/* loss of interest table */}
            <TableDivider/>


            <LossOfInterestTable principalData={totalOpExp.map((item) => (item*(percent/100)))}/>
        </>
    )
}

export default StressTest4