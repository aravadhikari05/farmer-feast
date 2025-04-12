
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import Header from "@/components/header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Farmer Feast",
  description:
    "Discover recipes based on fresh ingredients from local farmers markets.",
  icons: {
    icon: "favicon.ico",
  },
};

const geistSans = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center pt-36">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <Header />

              <div className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </div>
              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-12">
                <div> FarmerFeast</div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
