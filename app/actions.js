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
  const [teamDoc, gameDoc, games] = await Promise.all([
    getDoc(teamDocRef),
    getDoc(gameDocRef),
    getCollection("games"),
  ]);

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

  if (
    games[gameData?.index - 1] !== undefined &&
    games[gameData?.index - 1].points === 0
  ) {
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

export const updateBalance = async (prevState, formData) => {
  const mentor = formData.get("mentor");
  const amount = formData.get("amount");
  const mentorDocRef = doc(firestore, "users", mentor);
  const mentorDoc = await getDoc(mentorDocRef);

  console.log(mentor);

  if (Number(amount) === NaN) {
    return { success: false, message: "Only numbers are allowed!" };
  }

  if (!mentorDoc.exists()) {
    return { success: false, message: `There is no user with id: ${mentor}!` };
  }

  const mentorData = mentorDoc.data();

  await updateDoc(mentorDocRef, {
    balance:
      mentorData.balance === undefined
        ? Number(amount)
        : mentorData.balance + Number(amount),
  });

  return { success: true, message: "Amount added successfully!" };
};

export const handleBuy = async (prevState, formData) => {};

export const handleSell = async (prevState, formData) => {};
