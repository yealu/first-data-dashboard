"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, '0')
  return {
    month: `${month}월`,
    revenue: Math.floor(Math.random() * 1000000000),
    profitMargin: Math.random() * 30
  }
})

export function RevenueProfitChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>매출 및 순이익률 추이</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
                yAxisId="left"
                tickFormatter={(value) => `${(value / 100000000).toFixed(1)}억`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === 'revenue') return [`${(value / 100000000).toFixed(1)}억`, '매출']
                  return [`${value.toFixed(1)}%`, '순이익률']
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                name="매출"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="profitMargin"
                stroke="#82ca9d"
                name="순이익률"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 