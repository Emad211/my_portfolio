import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibe Prompt Studio",
  description: "A studio for generating prompt packs from Vibe Coding book.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans">{children}</body>
    </html>
  );
}
