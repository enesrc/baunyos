import "@/app/globals.css";
import { Suspense } from "react";

export const metadata = {
  title: {
    default: 'Balıkesir Üniversitesi Uluslararası Öğrenci Ofisi',
    template: '%s | BAUNYOS',
  },
  description: 'Uygulamanın genel açıklaması',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen bg-light-1 text-dark-3 dark:bg-dark-3 dark:text-light-2">
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}