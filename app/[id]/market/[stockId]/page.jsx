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
  const [datasets, setDatasets] = useState([{ data: [], label: "" }]);
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

      console.log(dataset);

      setDatasets([
        {
          data: dataset,
          label: stock.data().name,
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
