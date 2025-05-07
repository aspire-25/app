import React, { useState } from "react"
import StressTest5Input from "./stress-test-5-inputs"
import StressTest5InputSLC from "./stress-test-5-inputs-SLC"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const labels = [{title: "Loan Calculator Tab 5a", val: "LCT5a"}, {title: "Loan Calculator Tab 5b", val: "LCT5b"}, {title: "Simple Loan Calculator 5a", val: "SLC5a"}, {title: "Simple Loan Calculator 5b", val: "SLC5b"}]

const StressTest5 = () => {

    const [B5Output, setB5Output] = useState<number[]>([])

    const sendToParent = (data: Array<number>) => {
        // console.log(data)
        setB5Output(data)
    }

    return(
        <>
            <div>
                <Tabs defaultValue="LCT5a" className="w-full h-auto">
                    <p className="text-lg">Currently showing:</p>
                    <TabsList className="grid w-2/3 h-auto grid-cols-4 text-base">
                        {labels.map((item, index) => (
                            <TabsTrigger value={item.val} key={index} className="text-base text-balance">{item.title}</TabsTrigger>
                        ))} 
                    </TabsList>
                    {labels.map((item, index) => (
                        <>
                            <TabsContent value={item.val} key={index}>
                                <br></br>
                                {(item.val == "LCT5a") && <StressTest5Input onParamsUpdate={() => {}} version="A" intrDataFrom5b={B5Output}/>}

                                {(item.val == "LCT5b") && <StressTest5Input onParamsUpdate={sendToParent} version="B" intrDataFrom5b={[]}/>}

                                {(item.val == "SLC5a") && <StressTest5InputSLC />}

                                {(item.val == "SLC5b") && <StressTest5InputSLC />}

                            </TabsContent>
                        </>
                        
                    ))} 
    
                </Tabs>
            </div>
            
            
        </>
    )
    
}

export default StressTest5;