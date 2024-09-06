import { getDocument } from "@/app/actions";
import TransactionCard from "@/components/TransactionCard";
import Link from "next/link";
import React from "react";

export const revalidate = 60;

const PortfolioPage = async ({ params }) => {
  const { id } = params;
  const user = await getDocument("users", id);

  return (
    <div className="flex flex-col gap-10 w-full container">
      <div className="relative pb-8">
        <div className="flex justify-between px-4 items-end gap-5">
          <h2 className="text-lg lg:text-3xl font-semibold">{`${user.name}'s portfolio`}</h2>
          <p className="text-sm lg:text-base">
            Your balance:{" "}
            <span className="font-semibold">{user.balance} Tinta</span>
          </p>
        </div>
        <div className="w-screen h-px -translate-x-6 md:-translate-x-10 xl:-translate-x-[6.75rem] bg-neutral-400 absolute bottom-0"></div>
      </div>

      <div className="relative pb-10">
        <div className="w-full flex flex-col gap-5 px-4">
          <p className="text-base lg:text-lg">
            {!user?.stocks || user?.stocks?.length === 0
              ? "You don't have any open positions."
              : "Your open positions:"}
          </p>
          {!user?.stocks || user?.stocks?.length === 0 && (
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
          {user?.stocks && user?.stocks?.length > 0 && (
            <div className="flex flex-col divide-y divide-neutral-400">
              {user?.stocks?.map((stock, index) => (
                <div
                  key={`position-${index}`}
                  className="flex items-end justify-between"
                >
                  <p className="font-extrabold uppercase text-base lg:text-xl">
                    {stock.stockName}
                  </p>
                  <p className="text-sm lg:text-base">
                    Amount:{" "}
                    <span className="font-semibold">{stock.amount}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-screen h-px -translate-x-6 md:-translate-x-10 xl:-translate-x-[6.75rem] bg-neutral-400 absolute bottom-0"></div>
      </div>

      <div className="w-full flex flex-col gap-5 px-4">
        <p className="w-full text-lg">
          {user?.transactions && user?.transactions?.length > 0 ? (
            "Transactions:"
          ) : (
            <span className="w-full block text-center">
              There are no transactions yet!
            </span>
          )}
        </p>
        {!user?.transactions || user?.transactions?.length === 0 && (
          <Link
            href={`/${id}/market`}
            className="mx-auto mt-10 font-semibold inline-flex gap-2 items-center group"
          >
            Go to market{" "}
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
        {user?.transactions && user?.transactions?.length > 0 && (
          <div className="flex flex-col divide-y divide-neutral-400">
            {user.transactions.map((transaction, index) => (
              <TransactionCard
                key={`transactionCard-${index}`}
                transaction={transaction}
                userId={id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
