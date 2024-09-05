"use client";

import StockCard from "@/components/StockCard";
import { firestore } from "@/firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const MarketPage = ({ params }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, "stocks"), (snap) =>
      snap.docs.forEach((doc) => {
        setStocks((prev) => [...prev, { id: doc.id, ...doc.data() }]);
      })
    );

    return () => unsub();
  }, []);

  return (
    <div className="container w-full">
      <h1 className="text-3xl lg:text-5xl font-bold text-center mb-16">
        Welcome in the market!
      </h1>
      <div className="border-y divide-y flex flex-col">
        {stocks &&
          stocks.map((stock) => {
            return (
              <StockCard key={stock.id} stock={stock} userId={params.id} />
            );
          })}
      </div>
    </div>
  );
};

export default MarketPage;
