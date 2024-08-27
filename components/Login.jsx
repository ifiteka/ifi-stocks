"use client";

import { signIn } from "next-auth/react";
const Login = () => {
  return (
    <button
      onClick={() => signIn()}
      className="h-16 flex px-6 py-2 font-semibold items-center gap-3 w-32 justify-center border-2 border-primaryOrange text-primaryOrange bg-orange-200/80 hover:bg-orange-200 rounded-lg transition-colors"
    >
      Log In
    </button>
  );
};

export default Login;
