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
  serverTimestamp,
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

export const getDocument = async (coll, id) => {
  const res = await getDoc(doc(firestore, coll, id));

  return res.data();
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

  if (Number(points) > gameData.maxPoints) {
    return {
      success: false,
      message: `Could not add more points, than the game's maximum points (${gameData.maxPoints})`,
    };
  }

  const newPrice = calcPrice(
    teamData.price,
    Number(points),
    gameData.maxPoints
  );

  const newStockData = {
    allPrices: [
      ...teamData.allPrices,
      {
        game: gameData.name,
        gameIndex: gameData.index,
        price: Math.round(newPrice),
      },
    ],
    price: Math.round(newPrice),
    totalPoints: teamData.totalPoints + Number(points),
  };

  const hasPointsAddedForCurrentGame =
    gameData.points.find((point) => point.stockId === team) || null;

  if (hasPointsAddedForCurrentGame) {
    return {
      success: false,
      message: `${teamData.teamName} already has points added for ${gameData.name}`,
    };
  }

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
      points: [
        ...gameData.points,
        { team: teamData.teamName, points, stockId: team },
      ],
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

export const handleBuy = async (args, prevState, formData) => {
  const amount = Number(formData.get("amount"));
  const { stockId, userId } = args;
  const [stock, user] = await Promise.all([
    getDocument("stocks", stockId),
    getDocument("users", userId),
  ]);

  const currentStock = user?.stocks?.find((stock) => stock.stockId === stockId);

  if (currentStock) {
    currentStock.amount += amount;
  }

  await Promise.all([
    updateDoc(doc(firestore, "stocks", stockId), {
      activeShares: stock.activeShares - amount,
    }),
    updateDoc(doc(firestore, "users", userId), {
      stocks: currentStock
        ? user.stocks
        : [...user.stocks, { stockId, amount, stockName: stock.name }],
      balance: user.balance - Math.round(stock.price * amount),
      transactions: [
        ...user.transactions,
        {
          stockId,
          amount,
          date: `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
          price: stock.price,
          type: "buy",
        },
      ],
    }),
  ]);

  revalidatePath(`/${userId}/market/${stockId}`);

  return {
    success: true,
    message: `You bought ${amount} share(s) of ${stock.name} successfully!`,
  };
};

export const handleSell = async (args, prevState, formData) => {
  const amount = Number(formData.get("amount"));
  const { stockId, userId } = args;

  const [stock, user] = await Promise.all([
    getDocument("stocks", stockId),
    getDocument("users", userId),
  ]);

  const currentStock = user?.stocks?.find((stock) => stock.stockId === stockId);

  if (currentStock) {
    currentStock.amount -= amount;
  }

  await Promise.all([
    updateDoc(doc(firestore, "stocks", stockId), {
      activeShares: stock.activeShares + amount,
    }),
    updateDoc(doc(firestore, "users", userId), {
      stocks: currentStock
        ? currentStock.amount === 0
          ? [...user.stocks.filter((stock) => stock.stockId !== stockId)]
          : user.stocks
        : [...user.stocks, { stockId, amount }],
      balance: user.balance + Math.round(stock.price * amount),
      transactions: [
        ...user.transactions,
        {
          stockId,
          amount,
          date: `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
          price: stock.price,
          type: "sell",
        },
      ],
    }),
  ]);

  revalidatePath(`${userId}/market/${stockId}`);

  return {
    success: true,
    message: `You sold ${amount} share(s) of ${stock.name} successfully!`,
  };
};
