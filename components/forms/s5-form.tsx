"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface S5FormProps {
  year: string
}

export function S5Form({ year }: S5FormProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Financial Calculations</CardTitle>
          <p className="text-sm text-muted-foreground">Present value and interest calculations</p>
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
        </CardContent>
      )}
    </Card>
  )
}

