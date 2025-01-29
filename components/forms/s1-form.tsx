"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface S1FormProps {
  year: string
}

export function S1Form({ year }: S1FormProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>FC Input</CardTitle>
          <p className="text-sm text-muted-foreground">Financial Calculations Input</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="present-value">Present Value</Label>
            <Input id="present-value" type="number" placeholder="Enter present value" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interest-rate">Interest Rate (%)</Label>
            <Input id="interest-rate" type="number" placeholder="Enter interest rate" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="term">Term (years)</Label>
            <Input id="term" type="number" placeholder="Enter term in years" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contribution">Monthly Contribution</Label>
            <Input id="contribution" type="number" placeholder="Enter monthly contribution" />
          </div>
        </CardContent>
      )}
    </Card>
  )
}

