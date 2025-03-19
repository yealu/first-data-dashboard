"use client";

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { useSheetData, FinancialData, RevenueData } from "@/lib/hooks/useSheetData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

type PeriodType = "monthly" | "quarterly";

interface MonthlyStats {
  month: string;
  입금: number;
  출금: number;
  잔액: number;
  매출액?: number;
}

interface MonthlyStatsMap {
  [key: string]: MonthlyStats;
}

interface DailyBalance {
  date: string;
  balance: number;
}

export default function DetailPage() {
  const { data: financialData, error: financialError, isLoading: isFinancialLoading } = useSheetData<"financial">("financial");
  const { data: revenueData, error: revenueError, isLoading: isRevenueLoading } = useSheetData<"revenue">("revenue");
  const [periodType, setPeriodType] = useState<PeriodType>("monthly");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  // 일별 잔액 계산 (누적)
  const dailyBalances = useMemo(() => {
    if (!financialData) return [];

    const sortedData = [...financialData].sort((a, b) => 
      new Date(a.거래일).getTime() - new Date(b.거래일).getTime()
    );

    let currentBalance = 0;
    const balances: DailyBalance[] = [];

    sortedData.forEach((item: FinancialData) => {
      const inflow = parseInt(item.입금.replace(/,/g, '')) || 0;
      const outflow = parseInt(item.출금.replace(/,/g, '')) || 0;
      currentBalance += inflow - outflow;

      balances.push({
        date: item.거래일,
        balance: currentBalance
      });
    });

    return balances;
  }, [financialData]);

  // 기간 옵션 생성
  const periodOptions = useMemo(() => {
    if (!financialData || financialData.length === 0) return { months: [], quarters: [] };

    const uniqueMonths = new Set(financialData.map((item: FinancialData) => `${item.년}-${item.월.padStart(2, '0')}`));
    const months = Array.from(uniqueMonths).sort();

    const uniqueQuarters = new Set(
      financialData.map((item: FinancialData) => {
        const month = parseInt(item.월);
        const quarter = Math.ceil(month / 3);
        return `${item.년}-Q${quarter}`;
      })
    );
    const quarters = Array.from(uniqueQuarters).sort();

    return { months, quarters };
  }, [financialData]);

  // 현재 선택된 기간에 따른 데이터 필터링
  const filteredData = useMemo(() => {
    if (!financialData || !selectedPeriod) return financialData;

    return financialData.filter((item: FinancialData) => {
      if (periodType === "monthly") {
        const itemPeriod = `${item.년}-${item.월.padStart(2, '0')}`;
        return itemPeriod === selectedPeriod;
      } else {
        const month = parseInt(item.월);
        const quarter = Math.ceil(month / 3);
        const itemPeriod = `${item.년}-Q${quarter}`;
        return itemPeriod === selectedPeriod;
      }
    });
  }, [financialData, selectedPeriod, periodType]);

  // 선택된 기간의 요약 데이터 계산
  const summaryData = useMemo(() => {
    if (!filteredData) return null;

    const totalInflow = filteredData.reduce((sum: number, item: FinancialData) => sum + (parseInt(item.입금.replace(/,/g, '')) || 0), 0);
    const totalOutflow = filteredData.reduce((sum: number, item: FinancialData) => sum + (parseInt(item.출금.replace(/,/g, '')) || 0), 0);
    const balance = totalInflow - totalOutflow;

    return {
      totalInflow,
      totalOutflow,
      balance,
      transactionCount: filteredData.length
    };
  }, [filteredData]);

  // 월별 데이터 집계 (매출 데이터 포함)
  const monthlyData = useMemo(() => {
    if (!financialData) return [];

    const monthlyStats: MonthlyStatsMap = financialData.reduce((acc: MonthlyStatsMap, item: FinancialData) => {
      const month = `${item.년}-${item.월.padStart(2, '0')}`;
      if (!acc[month]) {
        acc[month] = {
          month,
          입금: 0,
          출금: 0,
          잔액: 0,
          매출액: 0
        };
      }
      acc[month].입금 += parseInt(item.입금.replace(/,/g, '')) || 0;
      acc[month].출금 += parseInt(item.출금.replace(/,/g, '')) || 0;
      acc[month].잔액 = acc[month].입금 - acc[month].출금;
      return acc;
    }, {});

    // 매출 데이터 추가
    if (revenueData) {
      revenueData.forEach((item: RevenueData) => {
        const date = new Date(item.날짜);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyStats[month]) {
          monthlyStats[month].매출액 = parseInt(item.매출액.replace(/,/g, '')) || 0;
        }
      });
    }

    return Object.values(monthlyStats).sort((a: MonthlyStats, b: MonthlyStats) => a.month.localeCompare(b.month));
  }, [financialData, revenueData]);

  if (isFinancialLoading || isRevenueLoading) {
    console.log('Loading data...', {
      isFinancialLoading,
      isRevenueLoading
    });
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">데이터를 불러오는 중...</h2>
        <p className="text-gray-500">잠시만 기다려주세요.</p>
      </div>
    </div>;
  }

  if (financialError || revenueError) {
    console.error('Error loading data:', {
      financialError,
      revenueError
    });
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2 text-red-600">데이터 로딩 오류</h2>
        <p className="text-gray-500">데이터를 불러오는 중 문제가 발생했습니다.</p>
        <p className="text-sm text-gray-400 mt-2">
          {financialError?.message || revenueError?.message}
        </p>
      </div>
    </div>;
  }

  console.log('Data loaded successfully:', {
    financialDataLength: financialData?.length,
    revenueDataLength: revenueData?.length,
    financialSample: financialData?.[0],
    revenueSample: revenueData?.[0]
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상세 페이지</h1>
        <div className="flex gap-4">
          <Select value={periodType} onValueChange={(value: PeriodType) => {
            setPeriodType(value);
            setSelectedPeriod("");
          }}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="기간 단위" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">월별</SelectItem>
              <SelectItem value="quarterly">분기별</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              {periodType === "monthly" 
                ? periodOptions.months.map((month: string) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))
                : periodOptions.quarters.map((quarter: string) => (
                    <SelectItem key={quarter} value={quarter}>
                      {quarter}
                    </SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>

      {summaryData && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">총 입금</h3>
            <p className="text-2xl font-bold">{summaryData.totalInflow.toLocaleString()}원</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">총 출금</h3>
            <p className="text-2xl font-bold">{summaryData.totalOutflow.toLocaleString()}원</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">잔액</h3>
            <p className="text-2xl font-bold">{summaryData.balance.toLocaleString()}원</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">거래 건수</h3>
            <p className="text-2xl font-bold">{summaryData.transactionCount}건</p>
          </Card>
        </div>
      )}

      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">누적 잔액 추이</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyBalances}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString() + '원'} />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#8884d8" name="잔액" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">월별 입출금 현황</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString() + '원'} />
                <Legend />
                <Bar dataKey="입금" fill="#82ca9d" name="입금" />
                <Bar dataKey="출금" fill="#ff7f7f" name="출금" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">월별 매출액 추이</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString() + '원'} />
                <Legend />
                <Line type="monotone" dataKey="매출액" stroke="#82ca9d" name="매출액" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
} 