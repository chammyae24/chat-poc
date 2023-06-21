"use client";
import useAuthContext from "@/app/context/auth-context/useAuthContext";
import { signIn, useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/"
    });

    setUsername("");
    setPassword("");
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
          value={username}
          name="username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          className="text-black"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="rounded bg-white px-6 py-3 text-black">
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
