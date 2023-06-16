"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Nav = () => {
  const { data: session } = useSession();

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
