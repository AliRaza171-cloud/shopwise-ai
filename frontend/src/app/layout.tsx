import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ComparisonProvider } from "@/context/ComparisonContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Sahi — AI Shopping Assistant",
  description:
    "Tell us what you want to buy and your budget — Sahi finds the best real product for the Pakistani market, verified by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Runs before paint so the correct theme applies immediately —
            without this, the page would flash light mode for a split
            second even if the user has dark mode saved. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('sahi_theme');
                  var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable} font-body`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ComparisonProvider>{children}</ComparisonProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
