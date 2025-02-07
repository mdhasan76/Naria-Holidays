import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "../component/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naria Holidays Task Manager",
  description: "Create by Md Hasan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  );
}
