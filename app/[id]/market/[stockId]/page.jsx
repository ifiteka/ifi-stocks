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
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase/config";

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
      setDatasets((prev) => [
        {
          data: [...prev[0].data, stock.data().price],
          label: stock.data().name,
        },
      ]);
    });

    const getAllGames = async () => {
      const games = await getDocs(collection(firestore, "games"));
      const newLabels = [];

      games.forEach((game) => {
        newLabels.push(game.data().name);
      });

      setLabels(newLabels);
    };

    getAllGames();

    return () => unsub();
  }, [stockId]);

  console.log(datasets);

  return (
    <div className="w-full">
      <Line data={chartData} width={1536} height={900}></Line>
    </div>
  );
};

export default StockPage;
