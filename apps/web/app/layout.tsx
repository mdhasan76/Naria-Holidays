import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "../component/Header";
import { Toaster } from "react-hot-toast";
import Providers from "./StoreProvider";

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
        <section className="max-w-max-w-8xl mx-auto">
          <Providers>
            <Toaster />
            <Header />
            <div>{children}</div>
          </Providers>
        </section>
      </body>
    </html>
  );
}
