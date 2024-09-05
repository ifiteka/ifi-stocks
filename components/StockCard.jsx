import Link from "next/link";
import React from "react";

const StockCard = ({ stock, userId, ...props }) => {
  return (
    <Link
      href={`/${userId}/market/${stock.id}`}
      {...props}
      className="w-full py-6 flex items-center justify-between"
    >
      <p className="uppercase font-extrabold text-base lg:text-xl">
        {stock.name}
      </p>

      <div>
        <p className="text-base">
          <span className="font-semibold">{stock.price}</span> Tinta
        </p>
      </div>
    </Link>
  );
};

export default StockCard;
