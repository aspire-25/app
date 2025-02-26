import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const StressTest1 = () => {

    const [modelParams, updateModelParams] = useState({
        presentValue: 50000,
        interestRate: 4.2,
        term: 30,
        reinvestedInterest: 100
    })

    const [tableData, updateTableData] = useState<{ year: number, balance: number, interestEarned: number, interestAndBalance: number }[]>([])

    const generateTableData = (presentValue: number, interestRate: number, term: number) => {
        const data = []
        let calculatedBalance = presentValue
        for (let i = 0; i < Number(term); i++) {
            if (i > 0) {
                calculatedBalance = data[i-1].interestAndBalance
            }

            data.push({
                year: i+1,
                balance: calculatedBalance,
                interestEarned: calculatedBalance * (interestRate / 100),
                interestAndBalance: calculatedBalance * (1 + (interestRate / 100))
            })
        }

        return data
    }

    const handleUpdate = (event : React.ChangeEvent<HTMLInputElement>) => {
        console.log("hey")
        const updatedParams = {...modelParams, [event.target.name] : event.target.value}
        updateModelParams(updatedParams);

        const updatedTableData = generateTableData(updatedParams.presentValue, updatedParams.interestRate, updatedParams.term)
        updateTableData(updatedTableData)

    }

    return (
        <div>
            <div className = "mb-10">
                {/* input */}
                <div className="w-1/4">
                    <Label htmlFor="presentValue" className="mb-1">Present Value ($)</Label>
                    <div className="flex">
                        <Input type="number" id="presentValue" placeholder="" className="base mb-3" onChange={handleUpdate} value={modelParams.presentValue} name="presentValue"/>
                        <Button type="submit" onClick={() => alert("Not functional yet!")}>Save</Button>
                    </div>

                    <Label htmlFor="interestRate" className="mb-1">Interest Rate (%)</Label>                  
                    <div className="flex">
                        <Input type="number" id="interestRate" placeholder="Enter in %" className="base mb-3" value={modelParams.interestRate} name="interestRate" onChange={handleUpdate}/>
                        <Button type="submit">Apply</Button>
                    </div>

                    <Label htmlFor="term" className="mb-1">Term (yrs)</Label>
                    <div className="flex">
                        <Input type="number" id="term" placeholder="Enter in years" className="base mb-3" value={modelParams.term} name="term" onChange={handleUpdate}/>
                        <Button type="submit">Apply</Button>
                    </div>

                    <Label htmlFor="reinvestedInterst" className="mb-1">Contribution Each Month (%)</Label>
                    <div className="flex">
                        <Input type="number" id="reinvestedInterest" placeholder="Reinvested interest - %" className="base mb-3" value={modelParams.reinvestedInterest} name="reinvestedInterest" onChange={handleUpdate}/>
                        <Button type="submit">Apply</Button>
                    </div>
                </div>

                {/* output summary */}
                <div className="w-4/5"></div>
            </div>
            
            {/* for the chart */}
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Year</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead>Interest Earned</TableHead>
                            <TableHead className="text-right">Interest Earned + Balance</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {tableData.map((item) => (
                        <TableRow key={item.year}>
                            <TableCell className="font-medium">{item.year}</TableCell>
                            <TableCell>${item.balance}</TableCell>
                            <TableCell>${item.interestEarned.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${item.interestAndBalance.toFixed(2)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
        </div>
    )
}

export default StressTest1