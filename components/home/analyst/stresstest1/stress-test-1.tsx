import StressTestInputs from "./stress-tests-inputs"
import LossOfInterestTable from "../lossOfInterestTable";
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
    import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
            <div className="flex justify-start w-100">
                <div className="w-[45%]">
                    <StressTestInputs onParamsUpdate={sendToParent}/>
                </div>
                <div className="w-[45%] ml-[7.5%]">
                    <StressTestInputs onParamsUpdate={sendToParent2}/>
                </div>
                
            </div>
            <br></br>
            <div className="text-2xl font-bold border-l-[5px] border-orange-900 text-white-900 pb-1 pt-1 pl-3 mb-3">Differences</div>

            {/* summary table */}

            <Tabs defaultValue="table" className="w-full h-auto">
                <div className="flex">
                    <p className="text-lg mt-auto mb-auto">Show as:</p>
                    <TabsList className="grid w-2/5 h-auto grid-cols-2 text-base ml-4">
                        <TabsTrigger value="table" className="text-base text-balance text-base">Table</TabsTrigger>
                        <TabsTrigger value="chart" className="text-base text-balance text-base">Chart</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="table">
                    <div className="w-[50%]">
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

                    </div>
                    
                </TabsContent>

                <ResponsiveContainer width = "95%" height={window.innerHeight *0.35}>
                    <LineChart data={stDiffs} margin={{ top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="6 6" />
                        <XAxis dataKey="year" />
                        <YAxis orientation="left"/>
                        <Tooltip separator=": $"/>
                        <Legend />
                        <Line type="monotone" dataKey="interestEarned" stroke="indigo" strokeWidth={2}/>
                        <Line type="monotone" dataKey="interestAndBalance" stroke="goldenrod" strokeWidth={2}/>
                    </LineChart>

                </ResponsiveContainer>
                <TabsContent value="chart">

                </TabsContent>
            </Tabs>
            

            <div style={{backgroundColor: "lightgray", height: "1vh", width: "100%", margin: "5% auto 5% auto"}}></div>

            {/* loss of interests table */}
            <LossOfInterestTable principalData={stDiffs}/>
        </>
    )
}

export default StressTest1