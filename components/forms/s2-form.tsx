"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface S2FormProps {
  year: string
}

export function S2Form({ year }: S2FormProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Revenue Forecast</CardTitle>
          <p className="text-sm text-muted-foreground">Revenue decrease projections</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="revenue-decrease">% Decrease in Revenues</Label>
            <Input id="revenue-decrease" type="number" placeholder="Enter percentage decrease" />
          </div>
        </CardContent>
      )}
    </Card>
  )
}

