import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Voice Assistant",
  description: "AI-powered voice assistant with speech recognition and task management",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function () {
              if (typeof window !== 'undefined' && !window.eruda) {
                var script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/eruda';
                script.onload = function () { window.eruda && window.eruda.init(); };
                document.body.appendChild(script);
              }
            })();
          `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
