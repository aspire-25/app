import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StressTest1 from "./stresstest1/stress-test-1"
import StressTest2 from "./stresstest2/stress-test-2"
import StressTest3 from "./stresstest3/stress-test-3"
import StressTest4 from "./stresstest4/stress-test-4"
import StressTest5 from "./stresstest5/stress-test-5"
import TableDivider from "./tableDivider"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react"

const AnalystLanding = () => {
    const labels = [
        {title: "Stress Test 1", val: "st1", description: "30% drop in return rate of investment"},
        {title: "Stress Test 2", val: "st2", description: "60% sustained drop in return rate of Investment"},
        {title: "Stress Test 3", val: "st3", description: "One-time X event of $50,000"},
        {title: "Stress Test 4", val: "st4",  description: "Increase 2.5% operating expenses each year"},
        {title: "Stress Test 5", val: "st5",  description: "Decrease bond return to 1.7% due to increase in inflation"},
    ]

    const [stType, setStType] = React.useState("st1")
    
    return (
        <div className="min-h-screen flex flex-col">
            <Select onValueChange={setStType}  >
                <div className = "flex text-lg mt-[2%] ml-[2%]">
                    <div className="mt-auto mb-auto bold text-2xl"><b>Now displaying:</b></div>
                    <div className="w-[60%] ml-[1%] border-4 border-cyan-900">
                        <SelectTrigger className="text-lg">
                            <SelectValue placeholder="Select a stress test..." defaultValue={"st1"} className="text-base"/>
                        </SelectTrigger>
                        <SelectContent>
                            {labels.map((item, index) => (
                                <SelectItem value={item.val} key={index} className="text-base">{item.title}: {item.description}</SelectItem>
                            ))}
                        </SelectContent>
                    </div>
                </div>
                
            </Select>

            <div style={{backgroundColor: "lightgray", height: "0.5vh", width: "50%", margin: "1.5% auto 0% 2%"}} />
            {/* Main Content */}
            <div className="m-5">

                {(stType == "st1") && <StressTest1 />}
                {(stType == "st2") && <StressTest2 />}
                {(stType == "st3") && <StressTest3 />}
                {(stType == "st4") && <StressTest4 />}
                {(stType == "st5") && <StressTest5 />}
            </div>
        </div>
    )
}

export default AnalystLanding