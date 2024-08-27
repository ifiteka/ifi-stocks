"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="fixed w-full items-center bg-black/10 backdrop-blur h-20 flex justify-between max-w-screen-2xl mx-auto px-10">
      <Link href="/" className="relative size-16">
        <Image
          src="/IFISTOX.png"
          fill
          alt="logo"
          className="size-full object-cover"
        />
      </Link>
      <nav className="flex gap-4 font-semibold">
        <Link href="/">Home</Link>
        <Link href="/user/market">Market</Link>
        <Link href="/user/portfolio">Portfolio</Link>
        <button onClick={() => signOut()}>Sign Out</button>
      </nav>
    </header>
  );
};

export default Navbar;
