"use client";

import Link from "next/link";
import { useUserData } from "@/lib/user-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function NavLinks() {
  const { user, loading } = useUserData();

  const commonLinks = [
    { href: "/equipment", label: "Equipment" },
    { href: "/about", label: "About Us" },
    { href: "/contacts", label: "Contacts" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-8 text-white font-medium">
      {loading ? (
        <>
          <Skeleton className="h-6 w-24 rounded bg-white/10" />
          <Skeleton className="h-6 w-24 rounded bg-white/10" />
          <Skeleton className="h-6 w-24 rounded bg-white/10" />
          <Skeleton className="h-6 w-24 rounded bg-white/10" />
        </>
      ) : (
        <>
          <Link
            href={user ? "/dashboard" : "/"}
            className="hover:text-green-300 transition-colors duration-200"
          >
            {user ? "Dashboard" : "Home"}
          </Link>

          {commonLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-green-300 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </>
      )}
    </nav>
  );
}