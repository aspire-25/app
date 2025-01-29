"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { S1Form } from "./forms/s1-form"
import { S2Form } from "./forms/s2-form"
import { S3Form } from "./forms/s3-form"
import { S4Form } from "./forms/s4-form"
import { S5Form } from "./forms/s5-form"
import { S5AForm } from "./forms/s5a-form"
import { S5BForm } from "./forms/s5b-form"
import { YearSelector } from "./year-selection"

export function TabsContainer() {
  const [selectedYear, setSelectedYear] = useState("2023")

  return (
    <div className="space-y-4">
      <YearSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
      <Tabs defaultValue="s1" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="s1">S1</TabsTrigger>
          <TabsTrigger value="s2">S2</TabsTrigger>
          <TabsTrigger value="s3">S3</TabsTrigger>
          <TabsTrigger value="s4">S4</TabsTrigger>
          <TabsTrigger value="s5">S5</TabsTrigger>
          <TabsTrigger value="s5a">S5A</TabsTrigger>
          <TabsTrigger value="s5b">S5B</TabsTrigger>
        </TabsList>
        <TabsContent value="s1">
          <S1Form year={selectedYear} />
        </TabsContent>
        <TabsContent value="s2">
          <S2Form year={selectedYear} />
        </TabsContent>
        <TabsContent value="s3">
          <S3Form year={selectedYear} />
        </TabsContent>
        <TabsContent value="s4">
          <S4Form year={selectedYear} />
        </TabsContent>
        <TabsContent value="s5">
          <S5Form year={selectedYear} />
        </TabsContent>
        <TabsContent value="s5a">
          <S5AForm year={selectedYear} />
        </TabsContent>
        <TabsContent value="s5b">
          <S5BForm year={selectedYear} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

