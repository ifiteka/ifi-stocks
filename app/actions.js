"use server";

import { firestore } from "@/firebase/config";
import { calcPrice } from "@/utils";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

export const getCollection = async (coll, useOrdering, orderByField, order) => {
  const data = [];
  const dataRes = useOrdering
    ? await getDocs(
        query(collection(firestore, coll), orderBy(orderByField, order))
      )
    : await getDocs(collection(firestore, coll));

  dataRes.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });

  return data;
};

export const updatePoints = async (formData) => {
  const team = formData.get("team");
  const points = formData.get("points");
  const game = formData.get("game");
  const teamDocRef = doc(firestore, "stocks", team);
  const gameDocRef = doc(firestore, "games", game);
  const games = await getCollection("games");
  const teamDoc = await getDoc(teamDocRef);
  const gameDoc = await getDoc(gameDocRef);
  if (!teamDoc.exists()) {
    throw new Error(`Team with id: ${team} does not exists!`);
  }

  if (!gameDoc.exists()) {
    throw new Error(`Game with id: ${game} does not exists!`);
  }

  const teamData = teamDoc.data();
  const gameData = gameDoc.data();
  const newPrice = calcPrice(teamData.price, Number(points));

  const newStockData = {
    allPrices: [
      ...teamData.allPrices,
      { game: gameData.name, gameIndex: gameData.index, price: newPrice },
    ],
    price: newPrice,
    totalPoints: teamData.totalPoints + Number(points),
  };

  if (games[gameData.index - 1].points.length === 0) {
    throw new Error(`Please add points for the previous game!`);
  } else {
    const newGameData = {
      points: [...gameData.points, { team: teamData.name, points }],
    };
    await updateDoc(gameDocRef, newGameData);
  }

  await updateDoc(teamDocRef, newStockData);
};
