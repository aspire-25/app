import { useState } from "react"
import StressTest5Input from "./stress-test-5-inputs"

const [B5Output, setB5Output] = useState<number[]>([])

const sendToParent = (data: Array<number>) => {
    // console.log(data)
    setB5Output(data)
}

const StressTest5 = () => {
    return(
        <>
            <StressTest5Input onParamsUpdate={sendToParent} version="B"/>
            {B5Output.map((item) => (<p>{item}</p>))}
        </>
    )
    
}

export default StressTest5;