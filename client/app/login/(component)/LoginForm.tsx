"use client";
import useAuthContext from "@/app/context/auth-context/useAuthContext";
import { signIn, useSession } from "next-auth/react";
import { FormEvent, useRef, useState } from "react";

const LoginForm = () => {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  console.log("updating");

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // await signIn("credentials", {
    //   username,
    //   password,
    //   redirect: true,
    //   callbackUrl: "/"
    // });

    // setUsername("");
    // setPassword("");

    if (usernameRef.current && passwordRef.current) {
      await signIn("credentials", {
        username: (usernameRef.current as any).value,
        password: (passwordRef.current as any).value,
        redirect: true,
        callbackUrl: "/"
      });

      (usernameRef.current as any).value = "";
      (passwordRef.current as any).value = "";
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center justify-center gap-4"
      >
        <input
          type="text"
          className="text-black"
          // value={username}
          name="username"
          // onChange={e => setUsername(e.target.value)}
          ref={usernameRef}
        />
        <input
          type="password"
          name="password"
          className="text-black"
          // value={password}
          // onChange={e => setPassword(e.target.value)}
          ref={passwordRef}
        />
        <button type="submit" className="rounded bg-white px-6 py-3 text-black">
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
