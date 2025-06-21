import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import LoadingTransition from "@/components/ui/LoadingTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crested Gecko Community",
  description: "게코 친구들과 소통하는 커뮤니티",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <LoadingTransition>
            {children}
          </LoadingTransition>
        </Providers>
      </body>
    </html>
  );
}
