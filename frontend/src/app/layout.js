import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Popcorn — Watch Together",
  description:
    "Stream movies from your Google Drive and watch with friends in real-time. Create a party room, invite your crew, and enjoy synchronized viewing.",
  keywords: ["watch party", "google drive", "movie streaming", "watch together"],
  openGraph: {
    title: "Popcorn — Watch Together",
    description: "Stream movies with friends from your Google Drive.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
