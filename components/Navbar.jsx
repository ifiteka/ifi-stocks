"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = ({ session }) => {
  return (
    <header className="fixed w-full flex items-center bg-black/10 backdrop-blur h-20">
      <div className="flex w-full items-center justify-between max-w-screen-2xl px-10 mx-auto">
        <Link href="/" className="relative size-16">
          <Image
            src="/IFISTOX.png"
            fill
            alt="logo"
            priority
            className="size-full object-cover"
          />
        </Link>
        <nav className="flex gap-4 font-semibold">
          <Link href="/">Home</Link>
          {/* {session.user.role !== "admin" ? (
            <>
              <Link href={`/${session?.user?.id}/market`}>Market</Link>
              <Link href={`/${session?.user?.id}/portfolio`}>Portfolio</Link>
            </>
          ): <>
            <Link href={'/admin/money-upload'}>Money upload</Link>
            <Link href={'/admin/point-upload'}>Point upload</Link>
          </>} */}
          <Link href={`/${session?.user?.id}/market`}>Market</Link>
          <Link href={`/${session?.user?.id}/portfolio`}>Portfolio</Link>
          <button onClick={() => signOut()}>Sign Out</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
