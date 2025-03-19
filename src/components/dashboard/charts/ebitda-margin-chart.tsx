"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, '0')
  return {
    month: `${month}월`,
    ebitdaMargin: 17 + Math.random() * 3
  }
})

export function EbitdaMarginChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>EBITDA 마진 추이</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                angle={0}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[17, 20]}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'EBITDA 마진']}
              />
              <Bar 
                dataKey="ebitdaMargin" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 