import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import Provider from "./provider";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "WittyBoard",
  description:
    "An AI Powered Whiteboard Platform for versatile users.",
  icons: {
    icon: "/icon.svg",
  },
};

const isClerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    // Clerk is optional for local scaffolding, but production deployments use
    // the provider and middleware to protect dashboard/workspace navigation.
  if (!isClerkConfigured) {
    return (
      <html lang="en">
        <body style={{ margin: 0, padding: 0 }}>
          {children}
          <Toaster />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body style={{ margin: 0, padding: 0 }} className="bg-linear-to-r from-gray-200 via-purple-300 to-purple-300">
          <Provider>{children}</Provider>
          <Toaster/>
        </body>
      </html>
    </ClerkProvider>
  );
}
