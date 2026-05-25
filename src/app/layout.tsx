import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khang Thịnh Investment | Hợp tác cùng phát triển",
  description:
    "Công ty TNHH Khang Thịnh Investment - Cung ứng Cát Đá San lấp, Xây dựng dân dụng, Vận chuyển đường thủy tại Tây Ninh và các tỉnh miền Nam.",
  keywords: [
    "Khang Thịnh",
    "cát đá san lấp",
    "xây dựng",
    "vận chuyển đường thủy",
    "Tây Ninh",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
