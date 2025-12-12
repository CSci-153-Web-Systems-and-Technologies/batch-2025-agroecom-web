import type { Metadata } from "next";
import "../globals.css";
import NavBar from "@/components/NavBar"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "AgroEcom",
  description: "An online marketplace for farmers to rent equipment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
          <NavBar />
          {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
