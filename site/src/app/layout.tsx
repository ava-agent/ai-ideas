import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Ideas - 精选 AI 产品创意库",
  description: "精选 AI 产品创意，涵盖教育、健康、金融、创作等多个领域",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 py-8">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-sm text-gray-400">
                AI Ideas · 精选最好的 AI 产品创意
              </p>
              <p className="text-xs text-gray-300">
                Built with Next.js · Powered by AI
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
