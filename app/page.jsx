"use client";

import React from "react";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data } = useSession();

  return <div>Home</div>;
};

export default Home;
