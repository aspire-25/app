import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StressTest1 from "./stresstest1/stress-test-1"
import StressTest2 from "./stresstest2/stress-test-2"
import StressTest3 from "./stresstest3/stress-test-3"
import StressTest4 from "./stresstest4/stress-test-4"
import StressTest5 from "./stresstest5/stress-test-5"
import TableDivider from "./tableDivider"

const AnalystLanding = () => {
    const labels = [
        {title: "Stress Test 1", val: "st1", description: "30% drop in return rate of investment"},
        {title: "Stress Test 2", val: "st2", description: "60% sustained drop in return rate of Investment"},
        {title: "Stress Test 3", val: "st3", description: "One-time &quot;X&quot; event of $50,000"},
        {title: "Stress Test 4", val: "st4",  description: "Increase 2.5% operating expenses each year"},
        {title: "Stress Test 5", val: "st5",  description: "Decrease bond return to 1.7% due to increase in inflation"},
    ]
    
    return (
        <div className="m-5">
            <Tabs defaultValue="st1" className="w-full h-auto">
                <TabsList className="grid w-full h-auto grid-cols-5 text-xl">
                    {labels.map((item, index) => (
                        <TabsTrigger value={item.val} key={index} className="text-xl">{item.title}</TabsTrigger>
                    ))} 
                </TabsList>
                <TableDivider />
                {labels.map((item, index) => (
                    <>
                        <TabsContent value={item.val} key={index}>
                            <div className="text-3xl mt-7"><b className="font-bold text-amber-900">{item.title}: {item.description} </b></div>
                            <br></br>
                            {(item.title == "Stress Test 1") && <StressTest1 />}
                            {(item.title == "Stress Test 2") && <StressTest2 />}
                            {(item.title == "Stress Test 3") && <StressTest3 />}
                            {(item.title == "Stress Test 4") && <StressTest4 />}
                            {(item.title == "Stress Test 5") && <StressTest5 />}
                        </TabsContent>
                    </>
                    
                ))} 

            </Tabs>
        </div>
    )
}

export default AnalystLanding