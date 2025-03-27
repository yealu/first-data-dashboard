"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, LineChart, PieChart } from "lucide-react"
import { RevenueProfitChart } from "@/components/dashboard/charts/revenue-profit-chart"
import { EbitdaMarginChart } from "@/components/dashboard/charts/ebitda-margin-chart"
import { ExpenseDistributionChart } from "@/components/dashboard/charts/expense-distribution-chart"
import { useDashboard } from "@/lib/context/dashboard-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useSheetData } from "@/lib/hooks/useSheetData"
import { Period, Department, Project } from "@/lib/types/dashboard"

function DashboardContent() {
  const { filters, updateFilters, filteredData } = useDashboard()
  const latestData = filteredData[filteredData.length - 1]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">financial dashboard</h1>
        <Link href="/dashboard/detail">
          <Button variant="outline" className="flex items-center gap-2">
            상세 페이지
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
        <div className="flex items-center space-x-2">
          <Select
            value={filters.period}
            onValueChange={(value) => updateFilters({ period: value as Period })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">월별</SelectItem>
              <SelectItem value="quarterly">분기별</SelectItem>
              <SelectItem value="yearly">연간</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">매출 성장률</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12.5%</div>
                <p className="text-xs text-muted-foreground">전월 대비 +2.1%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">순이익률</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestData?.profitMargin.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">전월 대비 +0.5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EBITDA 마진</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestData?.ebitdaMargin.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">전월 대비 -0.2%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROE</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">21.3%</div>
                <p className="text-xs text-muted-foreground">전월 대비 +1.2%</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <RevenueProfitChart />
            <EbitdaMarginChart />
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <ExpenseDistributionChart />
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>상세 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-2">
                    <Select
                      value={filters.department}
                      onValueChange={(value) => updateFilters({ department: value as Department })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="부서 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="sales">영업부</SelectItem>
                        <SelectItem value="marketing">마케팅부</SelectItem>
                        <SelectItem value="development">개발부</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.project}
                      onValueChange={(value) => updateFilters({ project: value as Project })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="프로젝트 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="project-a">프로젝트 A</SelectItem>
                        <SelectItem value="project-b">프로젝트 B</SelectItem>
                        <SelectItem value="project-c">프로젝트 C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
} 