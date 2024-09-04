"use client";

import { useSession } from "next-auth/react";

const Home = () => {
  const { data } = useSession();

  return (
    <div>
      <h1 className="text-7xl font-extrabold mt-10 mb-24">
        Welcome, {data?.user?.name}!
      </h1>
    </div>
  );
};

export default Home;
