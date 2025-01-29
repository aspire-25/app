"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface S4FormProps {
  year: string
}

export function S4Form({ year }: S4FormProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Analysis Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Percentage-based analysis</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="percentage">Percentage</Label>
            <Input id="percentage" type="number" placeholder="Enter percentage" />
          </div>
        </CardContent>
      )}
    </Card>
  )
}

