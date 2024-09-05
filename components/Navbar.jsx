"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Hamburger from "./icons/Hamburger";
import Close from "./icons/Close";
import { usePathname } from "next/navigation";

const Navbar = ({ session }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== window.location.href) {
      setOpen(false);
    }
  }, [pathname]);

  return (
    <header className="fixed w-full flex items-center bg-black/10 backdrop-blur h-20">
      <div className="flex w-full items-center justify-between container">
        <Link href="/" className="relative z-50 size-16">
          <Image
            src="/IFISTOX.png"
            fill
            alt="logo"
            priority
            className="size-full object-cover"
          />
        </Link>
        <div className="lg:hidden">
          {open ? (
            <button
              onClick={() => setOpen(false)}
              className="relative z-50 text-white"
            >
              <Close />
            </button>
          ) : (
            <button onClick={() => setOpen(true)}>
              <Hamburger />
            </button>
          )}
        </div>
        <nav
          className={`flex flex-col justify-center text-4xl lg:text-base gap-6 items-center w-full absolute bg-black/75 text-white lg:bg-transparent lg:text-black inset-0 lg:relative lg:flex-row lg:size-fit h-screen lg:gap-4 font-semibold transition-transform duration-700 lg:translate-x-0 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Link href="/">Home</Link>
          {session.user.role !== "admin" ? (
            <>
              <Link href={`/${session?.user?.id}/market`}>Market</Link>
              <Link href={`/${session?.user?.id}/portfolio`}>Portfolio</Link>
            </>
          ) : (
            <>
              <Link href={"/admin/money-upload"}>Money upload</Link>
              <Link href={"/admin/point-upload"}>Point upload</Link>
            </>
          )}
          <button onClick={() => signOut()}>Sign Out</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
