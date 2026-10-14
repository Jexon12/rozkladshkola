import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Розклад · Матроська гімназія",
  description: "Поточні уроки, розклад класів і вчителів, дзвінки та зміни.",
  manifest:'/manifest.webmanifest',
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple:'/push-icon-192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="antialiased">{children}</body>
    </html>
  );
}
