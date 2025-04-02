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

/* type ChildProps = {
    onParamsUpdate: (data: Array<number>) => void; // The function to send data back to the parent
    version: string,
    intrDataFrom5b: Array<number>
}; */

const StressTest5InputSLC =() => {

    /* ======= This function and object will be used to initialize state; thus it's put up here to make sure code is DRY. ======= */
    const defaults = {
        presentValue: 5000,
        interestRate: -1,
        term: 30,
        loanStartDate: new Date(2025, 0, 30),
        numPayments: 288,
        monthlyPayment: 23.80,
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

            const interestEarned = (calculatedBalance * (interestRate / 100))
            const interestAndBalance = (calculatedBalance * (1 + (interestRate / 100)))
            const amtPaidToInvestor = (interestEarned * ((100-reinvestedInterest)/100))
            const prinPaidTowardLoan = interestEarned - loanPayment
            const balancePayment = interestAndBalance - amtPaidToInvestor - loanPayment + interestPayment

            const totalPaidOnLoan = 0

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
                totalPaidOnLoan: totalPaidOnLoan
            })
        }

        return data
    }

    /* ======= */

    const [modelParams, updateModelParams] = useState<{
        presentValue: number,
        interestRate: number,
        term: number,
        loanStartDate: Date,
        monthlyPayment: number,
        numPayments: number
    }>(() => {
       return ({
            presentValue: 5000,
            interestRate: 0,
            term: 30,
            loanStartDate: new Date(2025, 0, 30),
            monthlyPayment: 23.80,
            numPayments: 288
        })
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

        defaultTableData = generateTableData(defaults.presentValue, defaults.interestRate, defaults.term, 0)

        // send default data to the parent component upon initialization
        /*
        if (version == "B") {
            onParamsUpdate(defaultTableData.map(e => e.interestEarned))
        }
        */
        return defaultTableData;
    })

    const handleUpdate = (event : React.ChangeEvent<HTMLInputElement>) => {
        // if the parameters values are NOT default, update the table data to reflect the change in parameters, and send the values to the parent.
        console.log(event.target.value)
        let updatedParams
        if (event.target.name == "loanStartDate") {
            updatedParams = {...modelParams, [event.target.name] : new Date(event.target.value)}
        } else {
            updatedParams = {...modelParams, [event.target.name] : Number(event.target.value)}
        }
       
        console.log(updatedParams)
        updateModelParams(updatedParams);

        const updatedTableData = generateTableData(updatedParams.presentValue, updatedParams.interestRate, updatedParams.term, 0)
        updateTableData(updatedTableData)

        // send to parent
        /*
        if (version == "B") {
            onParamsUpdate(updatedTableData.map(e => e.interestEarned))
        }
        */
    }

    return (
        <div className = "w-100">
            <div className = "flex w-100">

                {/* input parameters */}
            
                <div className = "w-1/2">
                    <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Parameters</div>
                    <div className="w-3/5">
                        <Label htmlFor="loanAmount" className="mb-1">Loan Amount ($)</Label>
                        <div className="flex">
                            <Input type="number" id="presentValue" placeholder="" className="text-base mb-3" onChange={handleUpdate} value={modelParams.presentValue} name="presentValue"/>
                            <Button type="submit" onClick={() => alert("Not functional yet!")}  className="bg-cyan-900">Save</Button>
                        </div>

                        <Label htmlFor="interestRate" className="mb-1">Ann. Interest Rate (%)</Label>                  
                        <div className="flex">
                            <Input type="number" id="interestRate" placeholder="Enter in %" className="text-base mb-3" value={modelParams.interestRate} name="interestRate" onChange={handleUpdate}/>
                            <Button type="submit"  className="bg-cyan-900">Save</Button>
                        </div>

                        <Label htmlFor="term" className="mb-1">Loan Period (yrs)</Label>
                        <div className="flex">
                            <Input type="number" id="term" placeholder="Enter in years" className="text-base mb-3" value={modelParams.term} name="term" onChange={handleUpdate}/>
                            <Button type="submit"  className="bg-cyan-900">Save</Button>
                        </div>

                        <Label htmlFor="loanStartDate" className="mb-1">Loan Start Date</Label>
                        <div className="flex">
                            <Input type="date" id="loanStartDate" placeholder="" className="text-base mb-3" name="loanStartDate" onChange={handleUpdate}/>
                            <Button type="submit"  className="bg-cyan-900">Save</Button>
                        </div>

                        <Label htmlFor="monthlyPayment" className="mb-1">Monthly Payment ($)</Label>
                        <div className="flex">
                            <Input type="number" id="monthlyPayment" placeholder="Monthly Payment ($)" className="text-base mb-3" value={modelParams.monthlyPayment} name="monthlyPayment" onChange={handleUpdate}/>
                            <Button type="submit" className="bg-cyan-900">Save</Button>
                        </div>

                        <Label htmlFor="numPayments" className="mb-1">Number of Payments</Label>
                        <div className="flex">
                            <Input type="number" id="numPayments" placeholder="Monthly Payment ($)" className="text-base mb-3" value={modelParams.numPayments} name="numPayments" onChange={handleUpdate}/>
                            <Button type="submit" className="bg-cyan-900">Save</Button>
                        </div>
                    </div>
                </div>

                {/* summary output */}

                <div  className = "w-1/2">
                    <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Output Summary</div>
                    <div>
                        <p className="text-base">
                            <b>At Yr 5:</b> Value = <b className="text-indigo-900">{tableData.length >= 5 ? "$" + Math.floor(tableData[4].newBalance) + " (Appreciation " + (((tableData[4].newBalance - modelParams.presentValue) / modelParams.presentValue)*100).toFixed(2) + "%)" : "N/A (please specify a greater year)"}</b>, Total interest earned = <b className="text-amber-900">{tableData.length >= 5 ? "$" + (tableData.slice(0, 5).reduce((total, item) => total + item.interestEarned, 0)).toFixed(2) : "N/A (please specify a greater year)"}</b>
                        </p>
                        <br></br>
                        <p className="text-base">
                            <b>At Yr 30:</b> Value = <b className="text-indigo-900">{tableData.length >= 30 ? "$" + Math.floor(tableData[29].newBalance) + " (Appreciation " + (((tableData[29].newBalance - modelParams.presentValue) / modelParams.presentValue)*100).toFixed(2) + "%)" : "N/A (please specify a greater year)"}</b>, Total interest earned = <b className="text-amber-900">{tableData.length >= 29 ? "$" + (tableData.slice(0, 30).reduce((total, item) => total + item.interestEarned, 0)).toFixed(2) : "N/A (please specify a greater year)"}</b>
                        </p>
                        <br></br>
                        <p className="text-base">
                            <b>Total loan payment: </b><b className="text-indigo-900">${(tableData.reduce((total, item) => total + item.loanPayment, 0)).toFixed(2)}</b>
                        </p>
                        <br></br>
                        <p className="text-base">
                            <b>Total amount of principal paid towards loan: </b><b className="text-indigo-900">${(tableData.reduce((total, item) => total + item.prinPaidTowardLoan, 0)).toFixed(2)}</b>
                        </p>
                    </div>
                </div>

            </div>

            <br></br>

            {/* for the chart */}

            <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Hahaha</div>
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
                                        <TableCell key={rowKey} className="text-base font-bold">{Math.round(item.year)}</TableCell>
                                    ) : (
                                        (Math.round(item[rowKey as keyof typeof item]) >= 0) ? 
                                        (<TableCell key={rowKey}>${Math.round(item[rowKey as keyof typeof item])}</TableCell>) : 
                                        (<TableCell key={rowKey} className="text-red-900">(${0-Math.round(item[rowKey as keyof typeof item])}) <sup>[neg]</sup></TableCell>)
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

export default StressTest5InputSLC