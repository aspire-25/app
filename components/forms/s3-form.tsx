"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface S3FormProps {
  year: string
}

export function S3Form({ year }: S3FormProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Expense Forecast</CardTitle>
          <p className="text-sm text-muted-foreground">Expense increase projections</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="expense-increase">Increase in Expenses (%)</Label>
            <Input id="expense-increase" type="number" placeholder="Enter percentage increase" />
          </div>
        </CardContent>
      )}
    </Card>
  )
}

