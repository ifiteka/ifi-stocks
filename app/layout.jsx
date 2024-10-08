import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Login from "@/components/Login";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "IfiStocks",
  description:
    "It's a simple stock game for an awesome event called Gyergyoi Ifinapok",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html>
      <body className={montserrat.className}>
        <SessionWrapper session={session}>
          {session && session.user ? (
            <>
              <Navbar session={session} />
              <main className="flex min-h-screen flex-col items-center pt-28">
                {children}
              </main>
            </>
          ) : (
            <main className="flex h-screen flex-col items-center justify-center bg-[url('/IFISTOX.png')] bg-center bg-no-repeat">
              <Login />
            </main>
          )}
        </SessionWrapper>
      </body>
    </html>
  );
}
