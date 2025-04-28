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
        interestRate: 5.0,
        loanStartDate: new Date(2025, 0, 30),
        numPayments: 288,
    }

    const generateTableData = (presentValue: number, interestRate: number, loanStartDate: Date, numPayments: number) => {
        const data = []
        let beginningBalance = presentValue
        let paymentDate = loanStartDate

        // calculate the monthly payment upfront
        let monthlyPayment = ((interestRate / 1200) * presentValue) / (1 - Math.pow(1+(interestRate / 1200), 0-numPayments))
        for (let i = 0; i < numPayments; i++) {
            if (i > 0) {
                beginningBalance = data[i-1].endingBalance
                paymentDate = new Date(data[i-1].paymentDate)
                if (paymentDate.getMonth() == 11) {
                    // if the month is december, set the month to 0 (Jan) and increment the year.
                    paymentDate.setMonth(0)
                    paymentDate.setFullYear(data[i-1].paymentDate.getFullYear() + 1)
                } else {
                    // if not, increment the months per usual.
                    paymentDate.setMonth(data[i-1].paymentDate.getMonth() + 1)
                }
            }
            console.log(paymentDate)
            const interest = (beginningBalance*((interestRate/100)/12))
            const principal = monthlyPayment - interest
            const endingBalance = beginningBalance - principal
            
            data.push({
                paymentDate: paymentDate,
                beginningBalance: beginningBalance,
                monthlyPayment: monthlyPayment,
                principal: principal,
                interest: interest,
                endingBalance: endingBalance
            })
        }
        console.log(data)
        return data
    }

    /* ======= */

    const [modelParams, updateModelParams] = useState<{
        presentValue: number,
        interestRate: number,
        loanStartDate: Date,
        numPayments: number
    }>(() => {
       return ({
            presentValue: 5000,
            interestRate: 5.0,
            loanStartDate: new Date(2025, 0, 30),
            numPayments: 288
        })
    })

    const [tableData, updateTableData] = useState<{ 
        paymentDate: Date,
        beginningBalance: number, 
        principal: number, 
        endingBalance: number ,
        monthlyPayment: number,
        interest: number,

    }[]>(() => {
        // calculate the table data and assign it to state.

        let defaultTableData: {
            paymentDate: Date,
            beginningBalance: number, 
            principal: number, 
            endingBalance: number ,
            monthlyPayment: number,
            interest: number,
        }[] = []

        defaultTableData = generateTableData(defaults.presentValue, defaults.interestRate, defaults.loanStartDate, defaults.numPayments)

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
            updatedParams = {...modelParams, [event.target.name] : new Date(event.target.value + ":")} // <- added this to convert to local time
        } else {
            updatedParams = {...modelParams, [event.target.name] : Number(event.target.value)}
        }
       
        console.log(updatedParams)
        updateModelParams(updatedParams);

        const updatedTableData = generateTableData(updatedParams.presentValue, updatedParams.interestRate, updatedParams.loanStartDate, updatedParams.numPayments)
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

                        {/*
                        <Label htmlFor="term" className="mb-1">Loan Period (yrs)</Label>
                        <div className="flex">
                            <Input type="number" id="term" placeholder="Enter in years" className="text-base mb-3" value={modelParams.term} name="term" onChange={handleUpdate}/>
                            <Button type="submit"  className="bg-cyan-900">Save</Button>
                        </div>
                        */}
                        
                        <Label htmlFor="loanStartDate" className="mb-1">Loan Start Date</Label>
                        <div className="flex">
                            <Input type="date" id="loanStartDate" placeholder="" className="text-base mb-3" name="loanStartDate" onChange={handleUpdate}/>
                            <Button type="submit"  className="bg-cyan-900">Save</Button>
                        </div>
                        
                        {/*
                        <Label htmlFor="monthlyPayment" className="mb-1">Monthly Payment ($)</Label>
                        <div className="flex">
                            <Input type="number" id="monthlyPayment" placeholder="Monthly Payment ($)" className="text-base mb-3" value={modelParams.monthlyPayment} name="monthlyPayment" onChange={handleUpdate}/>
                            <Button type="submit" className="bg-cyan-900">Save</Button>
                        </div>
                        */}

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
                            <b>Total Interest: </b> $<b className="text-indigo-900">{(tableData.reduce((total, item) => total + item.interest, 0)).toFixed(2)}</b>
                        </p>
                        <br></br>
                        <p className="text-base">
                            <b>Total cost of loan: </b> $<b className="text-indigo-900">{(tableData.reduce((total, item) => total + item.interest, 0) + modelParams.presentValue).toFixed(2)}</b>
                        </p>
                        <br></br>
                        <p className="text-base">
                            <b>Monthly payment: </b> $<b className="text-indigo-900">{((tableData.reduce((total, item) => total + item.interest, 0) + modelParams.presentValue) / modelParams.numPayments).toFixed(2)}</b>
                        </p>
                        <br></br>
                    </div>
                </div>

            </div>

            <br></br>

            {/* for the chart */}

            <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Payments by month</div>
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
                        {tableData.map((item, index) => (
                            <TableRow key={index} className="text-sm text-center">
                                {Object.keys(item).map((rowKey) => (
                                    // dumb TypeScript makes me put "item[rowKey as keyof typeof item]" instead of simply "item[rowKey]" 💀
                                    
                                    (rowKey == "paymentDate" ? (
                                        <TableCell key={rowKey} className="text-base font-bold">{(item[rowKey].getMonth() + 1) + "/" + item[rowKey].getDate() + "/" + item[rowKey].getFullYear()}</TableCell>
                                    ) : (
                                        (Math.round(item[rowKey as keyof unknown]) >= 0) ? 
                                        (<TableCell key={rowKey}>${Number(item[rowKey as keyof unknown]).toFixed(2)}</TableCell>) : 
                                        (<TableCell key={rowKey} className="text-red-900">(${0-Math.round(item[rowKey as keyof unknown])}) <sup>[neg]</sup></TableCell>)
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