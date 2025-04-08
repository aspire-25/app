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
    
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

    const [tableData, updateTableData] = useState<{ year: number, balance: number, interestEarned: number, interestAndBalance: number }[]>(() => {
        // calculate the table data and assign it to state.

        let defaultTableData: { year: number, balance: number, interestEarned: number, interestAndBalance: number }[] = []

        defaultTableData = generateTableData(defaults.presentValue, defaults.interestRate, defaults.term)

        // send default data to the parent component upon initialization
        onParamsUpdate(defaultTableData.map(e => e.interestAndBalance))
        return defaultTableData;
    })

    const validateField = (name: string, value: number): string => {
        // Validation rules
        switch (name) {
            case 'presentValue':
                if (value <= 0) return 'Present value must be greater than 0';
                if (value > 1000000000) return 'Present value is too large';
                break;
            case 'interestRate':
                if (value < 0) return 'Interest rate cannot be negative';
                if (value > 100) return 'Interest rate cannot exceed 100%';
                break;
            case 'term':
                if (value <= 0) return 'Term must be greater than 0';
                if (value > 100) return 'Term cannot exceed 100 years';
                break;
            case 'reinvestedInterest':
                if (value < 0) return 'Reinvested interest cannot be negative';
                if (value > 100) return 'Reinvested interest cannot exceed 100%';
                break;
        }
        return '';
    }

    const handleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const numValue = Number(value);
        
        // Validate the input
        const error = validateField(name, numValue);
        
        // Update validation errors
        setValidationErrors(prev => ({
            ...prev,
            [name]: error
        }));
        
        // Only update if there's no error
        if (!error) {
            const updatedParams = { ...modelParams, [name]: numValue };
            updateModelParams(updatedParams);
            
            try {
                const updatedTableData = generateTableData(
                    updatedParams.presentValue, 
                    updatedParams.interestRate, 
                    updatedParams.term
                );
                updateTableData(updatedTableData);
                
                // Send to parent
                onParamsUpdate(updatedTableData.map(e => e.interestAndBalance));
            } catch (err) {
                console.error("Error calculating table data:", err);
                // Handle calculation errors
                setValidationErrors(prev => ({
                    ...prev,
                    calculation: "Error calculating results. Please check your inputs."
                }));
            }
        }
    }

    return (
        <div className = "w-100">

            {/* input parameters */}
            <div>
                <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Parameters</div>
                <div className="w-3/5">
                    <Label htmlFor="presentValue" className="mb-1">Present Value ($)</Label>
                    <div className="flex">
                        <Input 
                            type="number" 
                            id="presentValue" 
                            placeholder="" 
                            className={`text-base mb-1 ${validationErrors.presentValue ? 'border-red-500' : ''}`} 
                            onChange={handleUpdate} 
                            value={modelParams.presentValue} 
                            name="presentValue"
                        />
                        <Button type="submit" onClick={() => alert("Not functional yet!")} className="bg-cyan-900">Save</Button>
                    </div>
                    {validationErrors.presentValue && (
                        <p className="text-red-500 text-xs mb-2">{validationErrors.presentValue}</p>
                    )}

                    <Label htmlFor="interestRate" className="mb-1">Interest Rate (%)</Label>                  
                    <div className="flex">
                        <Input 
                            type="number" 
                            id="interestRate" 
                            placeholder="Enter in %" 
                            className={`text-base mb-1 ${validationErrors.interestRate ? 'border-red-500' : ''}`} 
                            value={modelParams.interestRate} 
                            name="interestRate" 
                            onChange={handleUpdate}
                        />
                        <Button type="submit" className="bg-cyan-900">Save</Button>
                    </div>
                    {validationErrors.interestRate && (
                        <p className="text-red-500 text-xs mb-2">{validationErrors.interestRate}</p>
                    )}

                    <Label htmlFor="term" className="mb-1">Term (yrs)</Label>
                    <div className="flex">
                        <Input 
                            type="number" 
                            id="term" 
                            placeholder="Enter in years" 
                            className={`text-base mb-1 ${validationErrors.term ? 'border-red-500' : ''}`} 
                            value={modelParams.term} 
                            name="term" 
                            onChange={handleUpdate}
                        />
                        <Button type="submit" className="bg-cyan-900">Save</Button>
                    </div>
                    {validationErrors.term && (
                        <p className="text-red-500 text-xs mb-2">{validationErrors.term}</p>
                    )}

                    <Label htmlFor="reinvestedInterest" className="mb-1">Contribution Each Month (%)</Label>
                    <div className="flex">
                        <Input 
                            type="number" 
                            id="reinvestedInterest" 
                            placeholder="Reinvested interest - %" 
                            className={`text-base mb-1 ${validationErrors.reinvestedInterest ? 'border-red-500' : ''}`} 
                            value={modelParams.reinvestedInterest} 
                            name="reinvestedInterest" 
                            onChange={handleUpdate}
                        />
                        <Button type="submit" className="bg-cyan-900">Save</Button>
                    </div>
                    {validationErrors.reinvestedInterest && (
                        <p className="text-red-500 text-xs mb-2">{validationErrors.reinvestedInterest}</p>
                    )}
                    
                    {validationErrors.calculation && (
                        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                            {validationErrors.calculation}
                        </div>
                    )}
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
            <div className="overflow-y-auto h-[50vh]" >
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
                            <TableRow key={item.year} className="text-xs text-center">
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
    )
}

export default StressTestInputs
