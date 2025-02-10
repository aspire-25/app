import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


const AnalystLanding = () => {
    return (
        <div className="m-10">
            <Accordion type="single" collapsible >
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <div>
                            <p className = "text-4xl">Stress Test 1</p>
                            <p className = "base">Scenario #1 - 30% drop in return rate of Investment</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className = "base">Hey there</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
                <AccordionItem value="item-2">
                    <AccordionTrigger>
                        <div>
                            <p className = "text-4xl">Stress Test 2</p>
                            <p className = "base">60% sustained drop in return rate of Investment</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className = "base">Hey there</p> 
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
                <AccordionItem value="item-3">
                    <AccordionTrigger>
                        <div>
                            <p className = "text-4xl">Stress Test 3</p>
                            <p className = "base"> One-time &quot;X&quot; event of $50,000</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className = "base">Hey there</p> 
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
                <AccordionItem value="item-4">
                    <AccordionTrigger>
                        <div>
                            <p className = "text-4xl">Stress Test 4</p>
                            <p className = "base">Increase 2.5% operating expenses each year</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className = "base">Hey there</p> 
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
                <AccordionItem value="item-5">
                    <AccordionTrigger>
                        <div>
                            <p className = "text-4xl">Stress Test 5</p>
                            <p className = "base">Decrease bond return to 1.7% due to increase in inflation</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className = "base">Hey there</p> 
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


            <Accordion type="single" collapsible>
                <AccordionItem value="item-5a">
                    <AccordionTrigger>
                        <div>
                            <p className = "text-4xl">Stress Test 5a</p>
                            <p className = "base">Simple loan calculator</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className = "base">Hey there</p> 
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
                <AccordionItem value="item-5b">
                    <AccordionTrigger>
                        <div>
                            <p className = "text-4xl">Stress Test 5b</p>
                            <p className = "base">Simple loan calculator</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className = "base">Hey there</p> 
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default AnalystLanding