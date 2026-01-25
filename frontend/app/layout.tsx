import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "운세 AI - Anti-Gravity",
  description: "High-Precision On-Premise Fortune Telling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
      </head>
      <body className="font-sans antialiased text-[#191F28] bg-[#F2F4F6]">
        {children}
      </body>
    </html>
  );
}
