import Link from "next/link";
import { useUser } from "@/hooks/use-user";

export default function NavLinks() {
  const { user } = useUser();

  const getNavigationLinks = () => {
    const commonLinks = [
      { href: "/equipment", label: "Equipment" },
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contacts" },
    ];

    const authSpecificLinks = user
      ? [{ href: "/dashboard", label: "Dashboard" }]
      : [{ href: "/", label: "Home" }];

    return [...authSpecificLinks, ...commonLinks];
  };

  const navigationLinks = getNavigationLinks();

  return (
    <nav className="hidden md:flex items-center gap-8 text-white font-medium">
      {navigationLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-green-300 transition-colors duration-200"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}