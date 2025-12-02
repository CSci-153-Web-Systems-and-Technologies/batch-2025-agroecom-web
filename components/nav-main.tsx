"use client";

import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import NavLinks from "@/components/nav-links";

export default function NavBar() {
  return (
    <div className="w-full sticky top-0 bg-(--nav-bg) z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 flex justify-center items-center">
            <Image
              src="/nav_logo.png"
              width={60}
              height={60}
              alt="Logo of the web application"
            />
          </div>
          <h1 className="text-white text-xl sm:text-2xl font-extrabold font-poppins">
            AGROECOM EQUIPMENT RENTAL
          </h1>
        </div>
        <NavLinks />
        <div className="flex items-center gap-3">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}