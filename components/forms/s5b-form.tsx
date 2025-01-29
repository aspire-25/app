"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface S5BFormProps {
  year: string
}

export function S5BForm({ year }: S5BFormProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Loan Details B</CardTitle>
          <p className="text-sm text-muted-foreground">Secondary loan information</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="loan-amount">Loan Amount</Label>
            <Input id="loan-amount" type="number" placeholder="Enter loan amount" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="annual-rate">Annual Interest Rate (%)</Label>
            <Input id="annual-rate" type="number" placeholder="Enter annual interest rate" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="loan-period">Loan Period (years)</Label>
            <Input id="loan-period" type="number" placeholder="Enter loan period" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input id="start-date" type="date" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="monthly-payment">Monthly Payment</Label>
            <Input id="monthly-payment" type="number" placeholder="Enter monthly payment" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="num-payments">Number of Payments</Label>
            <Input id="num-payments" type="number" placeholder="Enter number of payments" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="total-interest">Total Interest</Label>
            <Input id="total-interest" type="number" placeholder="Enter total interest" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="total-cost">Total Cost of Loan</Label>
            <Input id="total-cost" type="number" placeholder="Enter total cost" />
          </div>
        </CardContent>
      )}
    </Card>
  )
}

