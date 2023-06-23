"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import useAuthContext from "./context/auth-context/useAuthContext";
import { useEffect } from "react";

const Nav = () => {
  const { data: session } = useSession();
  const { setAuthUser } = useAuthContext();

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    setAuthUser(session.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.accessToken]);

  return (
    <div className="flex justify-between bg-white px-8 py-4 text-black">
      <div className="flex gap-2">
        <Link href="/protected">Protected Page</Link>
        <Link href={"/chat/" + session?.user?.name}>Chat</Link>
      </div>

      <div className="flex gap-2">
        {session?.user ? (
          <>
            <p className="capitalize">{session.user.name}</p>
            <button onClick={() => signOut()}>Sign Out</button>
          </>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Nav;
