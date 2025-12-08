import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Login - AgroEcom",
  description: "Login to AgroEcom",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}