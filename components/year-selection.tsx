"use client"

import { Button } from "@/components/ui/button"

interface YearSelectorProps {
  selectedYear: string
  onYearChange: (year: string) => void
}

export function YearSelector({ selectedYear, onYearChange }: YearSelectorProps) {
  const years = ["2022", "2023", "2024"]

  return (
    <div className="flex gap-2">
      {years.map((year) => (
        <Button
          key={year}
          variant={selectedYear === year ? "default" : "outline"}
          onClick={() => onYearChange(year)}
          className="min-w-[100px]"
        >
          {year}
        </Button>
      ))}
      <Button variant="outline" className="min-w-[100px]">
        Add New Year
      </Button>
    </div>
  )
}

