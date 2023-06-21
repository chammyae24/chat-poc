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
  }, [session?.user.accessToken]);

  return (
    <div>
      <Link href="/protected">Protected Page</Link>
      <Link href={"/chat/" + session?.user?.name}>Chat</Link>

      <div>
        {session?.user ? (
          <>
            <p>{session.user.name}</p>
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
