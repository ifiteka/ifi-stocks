import { getDocument } from "@/app/actions";
import Link from "next/link";
import React from "react";

const TransactionCard = async ({ transaction, userId }) => {
  const stock = await getDocument("stocks", transaction.stockId);

  return (
    <Link
      href={`/${userId}/market/${transaction.stockId}`}
      className="flex flex-col justify-between py-3 gap-2 cursor-pointer"
    >
      <div className="mb-2">
        <div className="flex justify-between items-end">
          <p className="text-xl font-bold uppercase">{stock.name}</p>
          <p className="text-base text-neutral-500">{transaction.date}</p>
        </div>
        <p
          className={`font-semibold text-base capitalize ${
            transaction.type === "buy" ? "text-green-700" : "text-red-700"
          }`}
        >
          {transaction.type}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p>Price:</p>
        <p className="font-semibold text-base">{stock.price} Tinta</p>
      </div>
      <div className="flex justify-between items-center">
        <p>Amount:</p>
        <p className="font-semibold text-base">{transaction.amount}</p>
      </div>
    </Link>
  );
};

export default TransactionCard;
