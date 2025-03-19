"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { FinancialData, FilterOptions, Period, Department, Project } from '../types/dashboard'

// 샘플 데이터
const sampleData: FinancialData[] = [
  {
    month: "1월",
    revenue: 4000,
    profitMargin: 15.2,
    ebitdaMargin: 18.2,
    expenses: [
      { name: '인건비', value: 35 },
      { name: '운영비', value: 25 },
      { name: '마케팅비', value: 20 },
      { name: '임대료', value: 15 },
      { name: '기타', value: 5 },
    ]
  },
  {
    month: "2월",
    revenue: 4200,
    profitMargin: 15.5,
    ebitdaMargin: 18.5,
    expenses: [
      { name: '인건비', value: 34 },
      { name: '운영비', value: 26 },
      { name: '마케팅비', value: 19 },
      { name: '임대료', value: 15 },
      { name: '기타', value: 6 },
    ]
  },
  {
    month: "3월",
    revenue: 4500,
    profitMargin: 15.8,
    ebitdaMargin: 18.8,
    expenses: [
      { name: '인건비', value: 33 },
      { name: '운영비', value: 27 },
      { name: '마케팅비', value: 21 },
      { name: '임대료', value: 15 },
      { name: '기타', value: 4 },
    ]
  },
  {
    month: "4월",
    revenue: 4800,
    profitMargin: 15.4,
    ebitdaMargin: 18.4,
    expenses: [
      { name: '인건비', value: 35 },
      { name: '운영비', value: 24 },
      { name: '마케팅비', value: 22 },
      { name: '임대료', value: 15 },
      { name: '기타', value: 4 },
    ]
  },
  {
    month: "5월",
    revenue: 5000,
    profitMargin: 15.9,
    ebitdaMargin: 18.9,
    expenses: [
      { name: '인건비', value: 36 },
      { name: '운영비', value: 23 },
      { name: '마케팅비', value: 21 },
      { name: '임대료', value: 15 },
      { name: '기타', value: 5 },
    ]
  },
  {
    month: "6월",
    revenue: 5200,
    profitMargin: 16.2,
    ebitdaMargin: 19.2,
    expenses: [
      { name: '인건비', value: 35 },
      { name: '운영비', value: 25 },
      { name: '마케팅비', value: 20 },
      { name: '임대료', value: 15 },
      { name: '기타', value: 5 },
    ]
  }
]

interface DashboardContextType {
  data: FinancialData[]
  filters: FilterOptions
  updateFilters: (newFilters: Partial<FilterOptions>) => void
  filteredData: FinancialData[]
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data] = useState<FinancialData[]>(sampleData)
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'monthly',
    department: 'all',
    project: 'all',
  })

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // 필터링된 데이터 계산
  const filteredData = data.map(item => ({
    ...item,
    revenue: filters.department === 'all' ? item.revenue : item.revenue * 0.3,
    profitMargin: filters.department === 'all' ? item.profitMargin : item.profitMargin * 0.8,
    ebitdaMargin: filters.department === 'all' ? item.ebitdaMargin : item.ebitdaMargin * 0.9,
    expenses: item.expenses
  }))

  return (
    <DashboardContext.Provider value={{
      data,
      filters,
      updateFilters,
      filteredData,
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
} 