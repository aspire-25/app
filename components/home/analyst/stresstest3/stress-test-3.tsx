import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectTrigger, SelectGroup, SelectLabel, SelectItem, SelectValue } from "@/components/ui/select"
import TableDivider from "../tableDivider"
import LossOfInterestTable from "../lossOfInterestTable"

const years: number[] = [];
const currentDate = new Date()
for (let i = 0; i < 12; i++) {
    years.push(Number(currentDate.getFullYear()) + i)
}

const StressTest3 = () => {
    const [eventValue, setEventValue] = useState(50000)
    const [year, setYear] = useState <number> (() => {
        const currDate = new Date()
        return currDate.getFullYear()
    })
    
    return (
        <>

            {/* inputs for ST 2 */}
            <Label htmlFor="term" className="mb-1">Select year and amount</Label>
            <div className="w-2/5 flex">
                <Select onValueChange={(val) => setYear(Number(val))}>
                    <SelectTrigger >
                        <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Year</SelectLabel>
                            {years.map((yr) => (
                                <SelectItem value={yr.toString()} key={yr}>{yr}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input type="number" id="term" placeholder="Enter in %" className="text-lg mb-3" value={eventValue} name="term" onChange={(e) => (setEventValue(Number(e.target.value)))} />

                <Button type="submit"  className="bg-cyan-900">Save</Button>
            </div>

            {/* summary table */}
            <p className="font-bold text-red-600 text-base">⚠️Note: the current year ({years[0]}) is used as default if a year is not specified.</p><br/>
            
            {/* loss of interest table */}
            <TableDivider/>
            <LossOfInterestTable principalData={years.map((yr) => {
                if (yr == year) {
                    return eventValue
                } else {
                    return 0
                }
            })}/>
        </>
    )
}

export default StressTest3