// src\app\layout.tsx
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { metadata } from "@/lib/metadata/metadata";
import { geistSans, geistMono } from "@/fonts/fonts";
import GTMProvider from "@/components/analytics/GTMProvider";
import Script from "next/script";

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID; // no non-null assertion
console.log(GTM_ID);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* GTM base */}
        {GTM_ID && (
          <Script id="gtm-base" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-black dark:text-white`}>
        {/* GTM noscript (required) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Track SPA route changes */}
          {GTM_ID && <GTMProvider />}
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
