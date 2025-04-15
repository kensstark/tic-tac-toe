import { Theme } from "@radix-ui/themes";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tic Tac Toe",
  description: "A modern Tic Tac Toe game built with Next.js 14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Theme appearance="light" accentColor="blue" radius="medium">
          {children}
        </Theme>
      </body>
    </html>
  );
}
