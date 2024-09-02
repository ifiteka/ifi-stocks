"use client";
import { getCollection, handleBuy, handleSell } from "@/app/actions";
import Chevron from "@/components/icons/Chevron";
import Minus from "@/components/icons/Minus";
import Plus from "@/components/icons/Plus";
import SubmitButton from "@/components/SubmitButton";
import { firestore } from "@/firebase/config";
import { down, skipped } from "@/utils";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useFormState } from "react-dom";

ChartJS.register(LinearScale, CategoryScale, LineElement, PointElement);

const StockPage = ({ params }) => {
  const { stockId, id: userId } = params;
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(null);
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [datasets, setDatasets] = useState([
    {
      data: [],
      label: "",
    },
  ]);
  const [labels, setLabels] = useState([]);
  const [buyState, buyFormAction] = useFormState(
    handleBuy.bind(null, { stockId, userId }),
    null
  );
  const [sellState, sellFormAction] = useFormState(
    handleSell.bind(null, { stockId, userId }),
    null
  );
  const chartData = {
    labels,
    datasets,
    responsive: true,
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "stocks", stockId), (stock) => {
      const stockData = stock.data();
      const dataset = [];

      setPrice(stockData.price);

      stockData.allPrices.map((stock) => {
        if (stock.game === "base") {
          dataset[0] = stock.price;
          return;
        }

        dataset[stock.gameIndex + 1] = stock.price;
      });

      setDatasets([
        {
          data: dataset,
          label: stockData.name,
          borderColor: "rgb(75, 192, 192)",
          segment: {
            borderColor: (ctx) =>
              skipped(ctx, "rgb(0,0,0,0.2)") || down(ctx, "rgb(192,75,75)"),
            borderDash: (ctx) => skipped(ctx, [6, 6]),
          },
        },
      ]);
    });

    const getAllGames = async () => {
      const games = await getCollection("games", true, "index", "asc");
      const newLabels = ["base"];

      games.forEach((game) => {
        newLabels.push(game.name);
      });

      setLabels(newLabels);
    };

    getAllGames();

    const unsubUser = onSnapshot(doc(firestore, "users", userId), (snap) => {
      setUser(snap.data());
    });

    return () => {
      unsub();
      unsubUser();
    };
  }, [stockId]);

  const userStock = user?.stocks?.find((stock) => stock.stockId === stockId);

  const onSubmitBuy = (formData) => {
    const submittedAmount = formData.get("amount");

    if (
      confirm(
        `Are you sure you want to buy ${submittedAmount} share(s) for ${
          submittedAmount * price
        } Tinta?`
      )
    ) {
      buyFormAction(formData);
    }
  };

  const onSubmitSell = (formData) => {
    const submittedAmount = formData.get("amount");
    if (
      confirm(
        `Are you sure you want to sell ${submittedAmount} share(s) for ${
          submittedAmount * price
        } Tinta?`
      )
    ) {
      sellFormAction(formData);
    }
  };

  return (
    <div className="w-full grid grid-cols-12 gap-4 h-full px-4">
      <h1 className="w-full text-5xl mb-8 font-bold text-center row-span-1 col-span-12">
        {datasets[0].label}
      </h1>
      <div className="row-start-2 col-span-9 size-full">
        <Line data={chartData}></Line>
      </div>
      <div className="col-span-3 py-3 col-start-10 size-full flex flex-col gap-8">
        <div className="">
          Balance: <span className="font-semibold">{user?.balance}</span>
          {amount > 0 && open !== null && (
            <span
              className={open === "buy" ? "text-red-700" : "text-green-700"}
            >
              {open === "buy"
                ? ` - ${Math.round(amount * price)}`
                : ` + ${Math.round(amount * price)}`}
            </span>
          )}
        </div>

        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpen((prev) => (prev === "buy" ? null : "buy"))}
          >
            Buy
            <Chevron
              className={`transition-transform duration-300 ${
                open === "buy" ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          <div
            className={`w-full grid transition-[grid-template-rows] duration-300 ${
              open === "buy" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="mt-4 flex gap-2 items-start">
                <button
                  disabled={Math.round(amount * price) === user?.balance}
                  onClick={() => setAmount((prev) => prev + 1)}
                  className="mt-1 disabled:opacity-50"
                >
                  <Plus className="size-4" />
                </button>
                <form
                  action={onSubmitBuy}
                  className="w-full flex flex-col items-center"
                >
                  <input
                    type="text"
                    className="text-center"
                    id="amount"
                    name="amount"
                    value={amount}
                  />
                  <SubmitButton text="Buy" className="mt-2 w-full" />
                </form>
                <button
                  disabled={amount === 0}
                  onClick={() => setAmount((prev) => prev - 1)}
                  className="mt-1 disabled:opacity-50"
                >
                  <Minus className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {user && userStock && userStock.amount > 0 && (
          <div>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() =>
                setOpen((prev) => (prev === "sell" ? null : "sell"))
              }
            >
              Sell
              <Chevron
                className={`transition-transform duration-300 ${
                  open === "sell" ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            <div
              className={`w-full grid transition-[grid-template-rows] duration-300 ${
                open === "sell" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-4 flex gap-2 items-start">
                  <button
                    disabled={userStock.amount === amount}
                    onClick={() => setAmount((prev) => prev + 1)}
                    className="mt-1 disabled:opacity-50"
                  >
                    <Plus className="size-4" />
                  </button>
                  <form
                    action={onSubmitSell}
                    className="w-full flex flex-col items-center"
                  >
                    <input
                      type="text"
                      className="text-center"
                      id="amount"
                      name="amount"
                      value={amount}
                    />
                    <SubmitButton text="Sell" className="w-full mt-2" />
                  </form>
                  <button
                    disabled={amount === 0}
                    onClick={() => setAmount((prev) => prev - 1)}
                    className="mt-1 disabled:opacity-50"
                  >
                    <Minus className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockPage;
