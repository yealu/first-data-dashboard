import { google } from 'googleapis';
import { FinancialData, RevenueData, SheetType } from './hooks/useSheetData';

// 구글 시트 설정
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEETS = {
  financial: {
    name: '거래내역',
    range: 'A2:K'
  },
  revenue: {
    name: '매출',
    range: 'A2:C'
  }
} as const;

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return auth;
}

export async function getSheetData(sheetType: SheetType) {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const sheet = SHEETS[sheetType];
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheet.name}!${sheet.range}`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    if (sheetType === 'financial') {
      return rows.map(row => ({
        거래일: row[0] || '',
        년: row[1] || '',
        월: row[2] || '',
        일: row[3] || '',
        통장구분: row[4] || '',
        적요: row[5] || '',
        거래처: row[6] || '',
        입금: row[7] || '',
        출금: row[8] || '',
        계정과목: row[9] || '',
        비용성격: row[10] || '',
      })) as FinancialData[];
    } else {
      return rows.map(row => ({
        날짜: row[0] || '',
        매출액: row[1] || '0',
        비고: row[2] || ''
      })) as RevenueData[];
    }
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
} 