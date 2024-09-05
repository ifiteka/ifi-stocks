import { getDocument } from "@/app/actions";
import Link from "next/link";
import React from "react";

const TransactionCard = async ({ transaction, userId }) => {
  const stock = await getDocument("stocks", transaction.stockId);

  return (
    <Link
      href={`/${userId}/market/${transaction.stockId}`}
      className="flex flex-col justify-between py-3 gap-1 lg:gap-2 cursor-pointer"
    >
      <div className="mb-0.5 lg:mb-2">
        <div className="flex justify-between items-end">
          <p className="text-base lg:text-xl font-extrabold uppercase">
            {stock.name}
          </p>
          <p className="text-xs text-neutral-500 lg:text-base">
            {transaction.date}
          </p>
        </div>
        <p
          className={`font-semibold text-sm lg:text-base capitalize ${
            transaction.type === "buy" ? "text-green-700" : "text-red-700"
          }`}
        >
          {transaction.type}
        </p>
      </div>
      <div className="flex justify-between items-center text-sm lg:text-base">
        <p>Price:</p>
        <p className="font-semibold">{stock.price} Tinta</p>
      </div>
      <div className="flex justify-between items-center text-sm lg:text-base">
        <p>Amount:</p>
        <p className="font-semibold">{transaction.amount}</p>
      </div>
    </Link>
  );
};

export default TransactionCard;
