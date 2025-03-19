"use client";

import useSWR from 'swr';
import Papa from 'papaparse';

export interface FinancialData {
  거래일: string;
  년: string;
  월: string;
  일: string;
  통장구분: string;
  적요: string;
  거래처: string;
  입금: string;
  출금: string;
  계정과목: string;
  비용성격: string;
}

export interface RevenueData {
  날짜: string;
  매출액: string;
  비고: string;
}

export type SheetType = "financial" | "revenue";

const SHEET_URLS = {
  financial: 'https://docs.google.com/spreadsheets/d/1NZgGNgVwqkKVBdve9NA6aCZ_YpCOTcfi5_-c7BpIv4w/gviz/tq?tqx=out:csv&sheet=거래내역',
  revenue: 'https://docs.google.com/spreadsheets/d/1NZgGNgVwqkKVBdve9NA6aCZ_YpCOTcfi5_-c7BpIv4w/gviz/tq?tqx=out:csv&sheet=매출'
};

export type SheetData<T extends SheetType> = T extends "financial" ? FinancialData : RevenueData;

export function useSheetData<T extends SheetType>(sheetType: T) {
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const csvText = await response.text();
    
    return new Promise<SheetData<T>[]>((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          resolve(results.data as SheetData<T>[]);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  };

  const { data, error, isLoading } = useSWR<SheetData<T>[]>(
    SHEET_URLS[sheetType],
    fetcher,
    {
      refreshInterval: 30000, // 30초마다 새로고침
    }
  );

  return {
    data,
    error,
    isLoading
  };
} 