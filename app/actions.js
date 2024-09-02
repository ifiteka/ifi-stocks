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
import { revalidatePath } from "next/cache";

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

export const updatePoints = async (prevState, formData) => {
  const team = formData.get("team");
  const points = formData.get("points");
  const game = formData.get("game");
  const teamDocRef = doc(firestore, "stocks", team);
  const gameDocRef = doc(firestore, "games", game);
  const teamDoc = await getDoc(teamDocRef);
  const gameDoc = await getDoc(gameDocRef);
  const games = await getCollection("games");

  if (!teamDoc.exists()) {
    return {
      success: false,
      message: `Team with id: ${team} does not exists!`,
    };
  }

  if (!gameDoc.exists()) {
    return {
      success: false,
      message: `Game with id: ${game} does not exists!`,
    };
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

  if (gameData.index !== 0 && games[gameData?.index - 1].points.length === 0) {
    return {
      success: false,
      message: `Please add points for the previous game!`,
    };
  } else {
    const newGameData = {
      points: [...gameData.points, { team: teamData.teamName, points }],
    };
    await updateDoc(gameDocRef, newGameData);
  }
  await updateDoc(teamDocRef, newStockData);

  revalidatePath("/admin/point-upload");

  return { success: true, message: "Points added successfully" };
};
