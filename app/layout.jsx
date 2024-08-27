import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Login from "@/components/Login";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "IfiStocks",
  description:
    "It's a simple stock game for an awesome event called Gyergyoi Ifinapok",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  console.log(session);

  return (
    <html>
      <body className={montserrat.className}>
        <SessionWrapper session={session}>
          {session ? (
            <>
              <Navbar />
              <main className="flex min-h-screen flex-col items-center pt-28">
                {children}
              </main>
            </>
          ) : (
            <main className="flex h-screen flex-col items-center justify-center">
              <Login />
            </main>
          )}
        </SessionWrapper>
      </body>
    </html>
  );
}
