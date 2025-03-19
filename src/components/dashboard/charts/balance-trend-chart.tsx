"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';

interface Transaction {
  거래일: string;
  년: string;
  월: string;
  일: string;
  '통장 구분': string;
  적요: string;
  거래처: string;
  입금: string;
  출금: string;
  계정과목: string;
  '비용 성격': string;
}

interface MonthlyBalance {
  month: string;
  balance: number;
}

const BalanceTrendChart: React.FC = () => {
  const [monthlyBalances, setMonthlyBalances] = useState<MonthlyBalance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/testFile.csv');
        const text = await response.text();
        
        Papa.parse<Transaction>(text, {
          header: true,
          complete: (results) => {
            let runningBalance = 0;
            const balancesByMonth = new Map<string, number>();
            
            // 날짜순으로 정렬
            const sortedData = results.data
              .filter(transaction => transaction.년 && transaction.월 && transaction.일)
              .sort((a, b) => {
                const dateA = `${a.년}-${a.월.padStart(2, '0')}-${a.일.padStart(2, '0')}`;
                const dateB = `${b.년}-${b.월.padStart(2, '0')}-${b.일.padStart(2, '0')}`;
                return dateA.localeCompare(dateB);
              });

            sortedData.forEach((transaction: Transaction) => {
              if (!transaction.년 || !transaction.월 || !transaction.일) return;

              const inflow = transaction.입금
                ? Number(transaction.입금.replace(/[,\s]/g, '')) || 0 
                : 0;
              
              const outflow = transaction.출금
                ? Number(transaction.출금.replace(/[,\s]/g, '')) || 0
                : 0;
              
              // 누적 잔고 계산
              runningBalance += inflow - outflow;
              
              const month = `${transaction.년}-${transaction.월.padStart(2, '0')}`;
              balancesByMonth.set(month, runningBalance);
            });
            
            const sortedBalances = Array.from(balancesByMonth.entries())
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([month, balance]) => ({
                month,
                balance: Math.round(balance / 10000) // Convert to 만원 unit
              }));
            
            console.log('Processed balances:', sortedBalances); // 디버깅용 로그
            setMonthlyBalances(sortedBalances);
          },
          error: (error: Error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>월별 잔액 추이</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={monthlyBalances}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `${value.toLocaleString()}만원`}
                width={100}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()}만원`, '잔액']}
                labelFormatter={(label) => `${label} 월`}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceTrendChart; 