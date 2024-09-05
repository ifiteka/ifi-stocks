"use client";

import { firestore } from "@/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () => {
  const { data } = useSession();
  const { id } = data?.user || "";
  const [user, setUser] = useState();

  useEffect(() => {
    if (!id) return;

    const unsub = onSnapshot(doc(firestore, "users", id), (stock) => {
      setUser(stock.data());
    });

    return () => unsub();
  }, [id]);

  return (
    <div className="w-full container">
      {data?.user && (
        <h1 className="text-4xl lg:text-7xl font-extrabold text-center mt-10 mb-24">
          Welcome, {data?.user?.name}!
        </h1>
      )}
      <div className="w-full flex flex-col gap-5">
        <p className="text-sm lg:text-lg">
          {user?.stocks?.length === 0
            ? "You don't have any open positions yet."
            : "Your open positions:"}
        </p>
        {user?.stocks?.length === 0 && (
          <Link
            href={`/${id}/market`}
            className="mx-auto mt-10 font-semibold inline-flex gap-2 items-center group"
          >
            Get some shares
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 group-hover:translate-x-1 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        )}
        {user?.stocks?.length > 0 && (
          <div className="flex flex-col divide-y divide-neutral-400">
            {user?.stocks.map((stock, index) => (
              <div
                key={`position-${index}`}
                className="flex items-end justify-between"
              >
                <p className="font-extrabold uppercase text-base lg:text-xl">
                  {stock.stockName}
                </p>
                <p className="text-sm lg:text-bases">
                  Amount: <span className="font-semibold">{stock.amount}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
