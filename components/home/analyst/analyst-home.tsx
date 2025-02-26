import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StressTest1 from "./stress-test-1"

const AnalystLanding = () => {
    const labels = [
        {title: "Stress Test 1", description: "30% drop in return rate of investment"},
        {title: "Stress Test 2", description: "60% sustained drop in return rate of Investment"},
        {title: "Stress Test 3", description: "One-time &quot;X&quot; event of $50,000"},
        {title: "Stress Test 4", description: "Increase 2.5% operating expenses each year"},
        {title: "Stress Test 5", description: "Decrease bond return to 1.7% due to increase in inflation"},
        {title: "Stress Test 5a", description: "Simple loan calculator 1"},
        {title: "Stress Test 5b", description: "Simple loan calculator 2"}
    ]
    
    return (
        <div className="m-5">
            {labels.map((item) => (
                <Card key={item.title} className="shadow-sm rounded-xl mt-5 mb-5">
                    <CardContent className="p-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold">{item.title}</h3>
                            <p className = "base">{item.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                className="rounded-xl hover:bg-blue-100 transition-all" >
                                <p className="text-2xl p-5">Open</p>
                            </Button>
                        </div>
                    </CardContent>
                    <CardContent>
                        <br></br>
                        {(item.title == "Stress Test 1") && <StressTest1 />}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default AnalystLanding