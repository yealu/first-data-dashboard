"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

interface MonthlyExpense {
  month: string;
  expense: number;
}

const MonthlyExpenseChart: React.FC = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/testFile.csv');
        const text = await response.text();
        
        Papa.parse<Transaction>(text, {
          header: true,
          complete: (results) => {
            const expensesByYearMonth = new Map<string, number>();
            
            // 날짜순으로 정렬
            const sortedData = results.data
              .filter(transaction => transaction.년 && transaction.월 && transaction.일 && transaction.출금)
              .sort((a, b) => {
                const dateA = `${a.년}-${a.월.padStart(2, '0')}-${a.일.padStart(2, '0')}`;
                const dateB = `${b.년}-${b.월.padStart(2, '0')}-${b.일.padStart(2, '0')}`;
                return dateA.localeCompare(dateB);
              });

            // 각 월별 지출 합계 계산
            sortedData.forEach((transaction: Transaction) => {
              if (!transaction.출금) return;

              const expense = Number(transaction.출금.replace(/,/g, ''));
              if (expense > 0) {
                const month = transaction.월.padStart(2, '0') + '월';  // '01월' 형식으로 변경
                const currentExpense = expensesByYearMonth.get(month) || 0;
                expensesByYearMonth.set(month, currentExpense + expense);
              }
            });

            // 1월부터 12월까지의 데이터 생성
            const allMonths = Array.from({ length: 12 }, (_, i) => 
              `${String(i + 1).padStart(2, '0')}월`
            );

            const sortedExpenses = allMonths.map(month => ({
              month,
              expense: expensesByYearMonth.get(month) || 0
            }));
            
            console.log('Monthly Expenses:', sortedExpenses); // 디버깅용 로그
            setMonthlyExpenses(sortedExpenses);
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
        <CardTitle>월별 지출 추이</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={monthlyExpenses}
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
                tickFormatter={(value) => `${(value).toLocaleString()}원`}
                width={100}
              />
              <Tooltip 
                formatter={(value: number) => [`${(value).toLocaleString()}원`, '지출']}
                labelFormatter={(label) => label}
              />
              <Bar 
                dataKey="expense" 
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpenseChart; 