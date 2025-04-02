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

// const StressTest5Input: React.FC<ChildProps> = ({ onParamsUpdate }) => {}

const StressTest5Input = () => {

    /* ======= This function and object will be used to initialize state; thus it's put up here to make sure code is DRY. ======= */

    const defaults = {
        presentValue: 5000,
        interestRate: 6.0,
        term: 30,
        reinvestedInterest: 100
    }

    const generateTableData = (presentValue: number, interestRate: number, term: number, reinvestedInterest: number) => {
        const data = []
        let calculatedBalance = presentValue
        for (let i = 0; i < Number(term); i++) {
            if (i > 0) {
                calculatedBalance = data[i-1].balancePayment
            }

            // these values are taken from Stress Test 5A. Need to link to backend.
            const loanPayment = 394
            const interestPayment = 25

            const interestEarned = calculatedBalance * (interestRate / 100)
            const interestAndBalance = calculatedBalance * (1 + (interestRate / 100))
            const amtPaidToInvestor = interestEarned * ((100-reinvestedInterest)/100)
            const prinPaidTowardLoan = 0-(interestEarned - loanPayment)
            const balancePayment = interestAndBalance - amtPaidToInvestor - loanPayment + interestPayment

            data.push({
                year: i+1,
                balance: calculatedBalance,
                interestEarned: interestEarned,
                interestAndBalance: interestAndBalance,
                amtPaidToInvestor: amtPaidToInvestor,
                newBalance: interestAndBalance - amtPaidToInvestor,
                loanPayment: loanPayment, // <- value from 5A
                interestPayment: interestPayment, // <- value from 5A
                balancePayment: balancePayment,
                prinPaidTowardLoan: prinPaidTowardLoan,
                totalPaidOnLoan: 0

            })
        }

        return data
    }

    /* ======= */

    const [modelParams, updateModelParams] = useState({
        presentValue: 5000,
        interestRate: 6,
        term: 30,
        reinvestedInterest: 100
    })

    const [tableData, updateTableData] = useState<{ 
        year: number, 
        balance: number, 
        interestEarned: number, 
        interestAndBalance: number ,
        amtPaidToInvestor: number,
        newBalance: number,
        loanPayment: number,
        interestPayment: number,
        balancePayment: number,
        prinPaidTowardLoan: number,
        totalPaidOnLoan: number,
    
    }[]>(() => {
        // calculate the table data and assign it to state.

        let defaultTableData: { year: number, 
            balance: number, 
            interestEarned: number, 
            interestAndBalance: number ,
            amtPaidToInvestor: number,
            newBalance: number,
            loanPayment: number,
            interestPayment: number,
            balancePayment: number,
            prinPaidTowardLoan: number,
            totalPaidOnLoan: number }[] = []

        defaultTableData = generateTableData(defaults.presentValue, defaults.interestRate, defaults.term, defaults.reinvestedInterest)

        // send default data to the parent component upon initialization
        // onParamsUpdate(defaultTableData.map(e => e.interestAndBalance))
        return defaultTableData;
    })

    const handleUpdate = (event : React.ChangeEvent<HTMLInputElement>) => {
        // if the parameters values are NOT default, update the table data to reflect the change in parameters, and send the values to the parent.
        console.log("hey")
        const updatedParams = {...modelParams, [event.target.name] : Number(event.target.value)}
        console.log(updatedParams)
        updateModelParams(updatedParams);

        const updatedTableData = generateTableData(updatedParams.presentValue, updatedParams.interestRate, updatedParams.term, updatedParams.reinvestedInterest)
        updateTableData(updatedTableData)

        // send to parent
        // onParamsUpdate(updatedTableData.map(e => e.interestAndBalance))
    }

    return (
        <div className = "w-100">

            {/* input parameters */}
            <div>
                <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Parameters</div>
                <div className="w-3/5">
                    <Label htmlFor="presentValue" className="mb-1">Present Value ($)</Label>
                    <div className="flex">
                        <Input type="number" id="presentValue" placeholder="" className="text-base mb-3" onChange={handleUpdate} value={modelParams.presentValue} name="presentValue"/>
                        <Button type="submit" onClick={() => alert("Not functional yet!")}  className="bg-cyan-900">Save</Button>
                    </div>

                    <Label htmlFor="interestRate" className="mb-1">Interest Rate (%)</Label>                  
                    <div className="flex">
                        <Input type="number" id="interestRate" placeholder="Enter in %" className="text-base mb-3" value={modelParams.interestRate} name="interestRate" onChange={handleUpdate}/>
                        <Button type="submit"  className="bg-cyan-900">Save</Button>
                    </div>

                    <Label htmlFor="term" className="mb-1">Term (yrs)</Label>
                    <div className="flex">
                        <Input type="number" id="term" placeholder="Enter in years" className="text-base mb-3" value={modelParams.term} name="term" onChange={handleUpdate}/>
                        <Button type="submit"  className="bg-cyan-900">Save</Button>
                    </div>

                    <Label htmlFor="reinvestedInterest" className="mb-1">Contribution Each Month (%)</Label>
                    <div className="flex">
                        <Input type="number" id="reinvestedInterest" placeholder="Reinvested interest - %" className="text-base mb-3" value={modelParams.reinvestedInterest} name="reinvestedInterest" onChange={handleUpdate}/>
                        <Button type="submit" className="bg-cyan-900">Save</Button>
                    </div>
                </div>
            </div>

            <br></br>
            {/* output summary */}
            <div>
                <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Output Summary</div>
                <div>
                    <p className="text-base">
                        <b>At Yr 5:</b> <b className="text-indigo-900">{tableData.length >= 5 ? "$" + tableData[4].interestAndBalance.toFixed(2) + " (▲" + (((tableData[4].interestAndBalance - modelParams.presentValue) / modelParams.presentValue)*100).toFixed(2) + "%)" : "N/A (please specify a greater year)"}</b>, Interest Earned = <b className="text-amber-900">{tableData.length >= 5 ? "$" + (tableData[4].interestAndBalance - modelParams.presentValue).toFixed(2) : "N/A (please specify a greater year)"}</b>
                    </p>
                    <br></br>
                    <p className="text-base">
                        <b>At Year 30:</b> Value = <b className="text-indigo-900">{tableData.length >= 30 ? "$" + tableData[29].interestAndBalance.toFixed(2) + " (▲" + (((tableData[29].interestAndBalance - modelParams.presentValue) / modelParams.presentValue)*100).toFixed(2) + "%)" : "N/A (please specify a greater year)"}</b>, Interest Earned = <b className="text-amber-900">{tableData.length >= 30 ? "$" + (tableData[29].interestAndBalance - modelParams.presentValue).toFixed(2) : "N/A (please specify a greater year)"}</b></p>
                </div>
            </div>

            <br></br>
            {/* for the chart */}

            <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Output Table</div>
            <div className="overflow-y-auto" >
                <Table>
                    <TableHeader>
                        <TableRow className="text-base">
                            {Object.keys(tableData[0]).map((key) => (
                                /* convert the camelCase keys into "proper" table headings. */
                                <TableHead className="text-center" key={key}>{(key.replace(/[A-Z]/g, letter => ` ${letter}`))[0].toUpperCase() + (key.replace(/[A-Z]/g, letter => ` ${letter}`)).slice(1)}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    
                    {/* table body */}
                    <TableBody>
                        {tableData.map((item) => (
                            <TableRow key={item.year} className="text-xs text-center">
                                {Object.keys(item).map((rowKey) => (
                                    // dumb TypeScript makes me put "item[rowKey as keyof typeof item]" instead of simply "item[rowKey]" 💀

                                    (rowKey == "year" ? (
                                        <TableCell key={rowKey} className="text-base font-bold">{Math.round(item[rowKey as keyof typeof item])}</TableCell>
                                    ) : (
                                        <TableCell key={rowKey}>${Math.round(item[rowKey as keyof typeof item])}</TableCell>
                                    ))
                                    
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                    
                </Table>
            </div>
        </div>
    )
}

export default StressTest5Input