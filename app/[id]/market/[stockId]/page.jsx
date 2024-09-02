"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Legend,
  Title,
} from "chart.js";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { getCollection } from "@/app/actions";
import { down, skipped } from "@/utils";

ChartJS.register(
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
  Legend,
  Title
);

const StockPage = ({ params }) => {
  const { stockId } = params;
  const [datasets, setDatasets] = useState([
    {
      data: [],
      label: "",
    },
  ]);
  const [labels, setLabels] = useState([]);
  const chartData = {
    labels,
    datasets,
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "stocks", stockId), (stock) => {
      const stockData = stock.data();
      const dataset = [];

      stockData.allPrices.map((stock) => {
        if (stock.game === "base") {
          dataset[0] = stock.price;
          return;
        }

        dataset[stock.gameIndex + 1] = stock.price;
      });

      setDatasets((prev) => [
        {
          data: dataset,
          label: stock.data().name,
          borderColor: "rgb(75, 192, 192)",
          pointStyle: false,
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

    return () => unsub();
  }, [stockId]);

  return (
    <div className="w-full">
      <Line data={chartData} width={1536} height={900}></Line>
    </div>
  );
};

export default StockPage;
