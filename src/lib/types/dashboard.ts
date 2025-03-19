export type Period = 'monthly' | 'quarterly' | 'yearly'
export type Department = 'all' | 'sales' | 'marketing' | 'development'
export type Project = 'all' | 'project-a' | 'project-b' | 'project-c'

export interface FinancialData {
  month: string
  revenue: number
  profitMargin: number
  ebitdaMargin: number
  expenses: {
    name: string
    value: number
  }[]
}

export interface FilterOptions {
  period: Period
  department: Department
  project: Project
} 