import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: { default: "Mầm — Nhật ký mẹ và bé", template: "%s · Mầm" },
  description: "Nhật ký riêng tư, nhẹ nhàng cho mẹ và bé.",
  applicationName: "Mầm",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Mầm" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fdf1f2" }, { media: "(prefers-color-scheme: dark)", color: "#2b1a1e" }] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning className={geist.variable}>
      <body className="min-h-dvh antialiased">
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.theme==='dark'||(!('theme' in localStorage)&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}" }} />
        {children}
      </body>
    </html>
  );
}
