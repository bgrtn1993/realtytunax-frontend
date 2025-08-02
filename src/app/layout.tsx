import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "RealtyTunax Emlak Portalı",
    description: "Hayalinizdeki emlağı kolayca bulun. RealtyTunax ile emlak arayışınız sona ersin.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
        <body className={inter.className}>
        <Navbar />
        {children}
        </body>
        </html>
    );
}
