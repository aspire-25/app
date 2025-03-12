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

type ChildProps = {
    onParamsUpdate: (data: Array<number>) => void; // The function to send data back to the parent
};

const StressTestInputs: React.FC<ChildProps> = ({ onParamsUpdate }) => {

    /* ======= This function and object will be used to initialize state; thus it's put up here to make sure code is DRY. ======= */

    const defaults = {
        presentValue: 50000,
        interestRate: 4.2,
        term: 30,
        reinvestedInterest: 100
    }

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

    /* ======= */

    const [modelParams, updateModelParams] = useState({
        presentValue: 50000,
        interestRate: 4.2,
        term: 30,
        reinvestedInterest: 100
    })

    const [tableData, updateTableData] = useState<{ year: number, balance: number, interestEarned: number, interestAndBalance: number }[]>(() => {
        // calculate the table data and assign it to state.

        let defaultTableData: { year: number, balance: number, interestEarned: number, interestAndBalance: number }[] = []

        defaultTableData = generateTableData(defaults.presentValue, defaults.interestRate, defaults.term)

        // send default data to the parent component upon initialization
        onParamsUpdate(defaultTableData.map(e => e.interestAndBalance))
        return defaultTableData;
    })

    const handleUpdate = (event : React.ChangeEvent<HTMLInputElement>) => {
        // if the parameters values are NOT default, update the table data to reflect the change in parameters, and send the values to the parent.
        console.log("hey")
        const updatedParams = {...modelParams, [event.target.name] : Number(event.target.value)}
        updateModelParams(updatedParams);

        const updatedTableData = generateTableData(updatedParams.presentValue, updatedParams.interestRate, updatedParams.term)
        updateTableData(updatedTableData)

        // send to parent
        onParamsUpdate(updatedTableData.map(e => e.interestAndBalance))
    }

    return (
        <div>
            <div className = "flex justify-between w-100">
                <div className="w-2/5">
                    {/* input parameters */}
                    <div>
                        <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Parameters</div>
                        <Label htmlFor="presentValue" className="mb-1">Present Value ($)</Label>
                        <div className="flex">
                            <Input type="number" id="presentValue" placeholder="" className="text-lg mb-3" onChange={handleUpdate} value={modelParams.presentValue} name="presentValue"/>
                            <Button type="submit" onClick={() => alert("Not functional yet!")}  className="bg-cyan-900">Save</Button>
                        </div>

                        <Label htmlFor="interestRate" className="mb-1">Interest Rate (%)</Label>                  
                        <div className="flex">
                            <Input type="number" id="interestRate" placeholder="Enter in %" className="text-lg mb-3" value={modelParams.interestRate} name="interestRate" onChange={handleUpdate}/>
                            <Button type="submit"  className="bg-cyan-900">Save</Button>
                        </div>

                        <Label htmlFor="term" className="mb-1">Term (yrs)</Label>
                        <div className="flex">
                            <Input type="number" id="term" placeholder="Enter in years" className="text-lg mb-3" value={modelParams.term} name="term" onChange={handleUpdate}/>
                            <Button type="submit"  className="bg-cyan-900">Save</Button>
                        </div>

                        <Label htmlFor="reinvestedInterst" className="mb-1">Contribution Each Month (%)</Label>
                        <div className="flex">
                            <Input type="number" id="reinvestedInterest" placeholder="Reinvested interest - %" className="text-lg mb-3" value={modelParams.reinvestedInterest} name="reinvestedInterest" onChange={handleUpdate}/>
                            <Button type="submit" className="bg-cyan-900">Save</Button>
                        </div>
                    </div>

                    <br></br>
                    {/* output summary */}
                    <div>
                        <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Output Summary</div>
                        <div>
                            <p className="text-base"><u>At Year 5: </u></p>

                            <p className="text-base">Value = <b className="text-indigo-900">{tableData.length >= 5 ? "$" + tableData[4].interestAndBalance.toFixed(2) + " (▲" + (((tableData[4].interestAndBalance - modelParams.presentValue) / modelParams.presentValue)*100).toFixed(2) + "%)" : "N/A (please specify a greater year)"}</b></p>

                            <p className="text-base">Interest Earned = <b className="text-amber-900">{tableData.length >= 5 ? "$" + (tableData[4].interestAndBalance - modelParams.presentValue).toFixed(2) : "N/A (please specify a greater year)"}</b></p>
                        </div>

                        <br></br>
                        <div>
                            <p className="text-base"><u>At Year 30: </u></p>

                            <p className="text-base">Value = <b className="text-indigo-900">{tableData.length >= 30 ? "$" + tableData[29].interestAndBalance.toFixed(2) + " (▲" + (((tableData[29].interestAndBalance - modelParams.presentValue) / modelParams.presentValue)*100).toFixed(2) + "%)" : "N/A (please specify a greater year)"}</b></p>

                            <p className="text-base">Interest Earned = <b className="text-amber-900">{tableData.length >= 30 ? "$" + (tableData[29].interestAndBalance - modelParams.presentValue).toFixed(2) : "N/A (please specify a greater year)"}</b></p>
                        </div>
                    </div>
                </div>
                {/* for the chart */}
                <div className="w-1/2">
                    <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Output Table</div>
                    <div className="overflow-y-auto h-[70vh]" >
                        <Table>
                            <TableHeader>
                                <TableRow className="text-base">
                                    <TableHead className="text-center">Year</TableHead>
                                    <TableHead className="text-center">Balance</TableHead>
                                    <TableHead className="text-center">Interest Earned</TableHead>
                                    <TableHead className="text-center">Interest Earned + Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableData.map((item) => (
                                    <TableRow key={item.year} className="text-sm text-center">
                                        <TableCell>{item.year}</TableCell>
                                        <TableCell>${item.balance.toFixed(2)}</TableCell>
                                        <TableCell className="text-indigo-900"><b>${item.interestEarned.toFixed(2)}</b></TableCell>
                                        <TableCell className="text-amber-900"><b>${item.interestAndBalance.toFixed(2)}</b></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StressTestInputs