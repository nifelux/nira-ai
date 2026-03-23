// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
    variable: "--font-inter",
      display: "swap",
      });

      export const metadata: Metadata = {
        title: {
            default: "NIRA AI — Learn. Build. Earn.",
                template: "%s | NIRA AI",
                  },
                    description:
                        "NIRA AI is your intelligent study companion and career mentor. Learn faster, build real skills, and grow your career.",
                          keywords: [
                              "AI tutor",
                                  "career mentor",
                                      "study assistant",
                                          "skill building",
                                              "interview prep",
                                                  "resume help",
                                                      "learning platform",
                                                        ],
                                                          authors: [{ name: "NIRA AI" }],
                                                            creator: "NIRA AI",
                                                              metadataBase: new URL(
                                                                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                                                                    ),
                                                                      openGraph: {
                                                                          type: "website",
                                                                              locale: "en_US",
                                                                                  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                                                                                      siteName: "NIRA AI",
                                                                                          title: "NIRA AI — Learn. Build. Earn.",
                                                                                              description:
                                                                                                    "Your intelligent study companion and career mentor. Learn faster, build real skills, and grow your career.",
                                                                                                      },
                                                                                                        twitter: {
                                                                                                            card: "summary_large_image",
                                                                                                                title: "NIRA AI — Learn. Build. Earn.",
                                                                                                                    description:
                                                                                                                          "Your intelligent study companion and career mentor. Learn faster, build real skills, and grow your career.",
                                                                                                                            },
                                                                                                                              robots: {
                                                                                                                                  index: true,
                                                                                                                                      follow: true,
                                                                                                                                        },
                                                                                                                                        };

                                                                                                                                        export const viewport: Viewport = {
                                                                                                                                          themeColor: "#7c3aed",
                                                                                                                                            width: "device-width",
                                                                                                                                              initialScale: 1,
                                                                                                                                                maximumScale: 1,
                                                                                                                                                };

                                                                                                                                                export default function RootLayout({
                                                                                                                                                  children,
                                                                                                                                                  }: {
                                                                                                                                                    children: React.ReactNode;
                                                                                                                                                    }) {
                                                                                                                                                      return (
                                                                                                                                                          <html lang="en" className={inter.variable}>
                                                                                                                                                                <body className="font-sans antialiased bg-gray-50 text-gray-900">
                                                                                                                                                                        {children}
                                                                                                                                                                              </body>
                                                                                                                                                                                  </html>
                                                                                                                                                                                    );
                                                                                                                                                                                    }