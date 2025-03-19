import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/lib/context/dashboard-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "금융 대시보드",
  description: "재무팀 및 경영진을 위한 실시간 재무 데이터 시각화 및 분석 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <DashboardProvider>
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </DashboardProvider>
      </body>
    </html>
  );
}
