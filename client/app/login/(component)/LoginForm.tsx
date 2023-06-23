"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useRef } from "react";

const LoginForm = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  console.log("updating");

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (usernameRef.current && passwordRef.current) {
      await signIn("credentials", {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
        redirect: true,
        callbackUrl: "/"
      });

      usernameRef.current.value = "";
      passwordRef.current.value = "";
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
          name="username"
          ref={usernameRef}
        />
        <input
          type="password"
          name="password"
          className="text-black"
          ref={passwordRef}
        />
        <button type="submit" className="rounded bg-white px-6 py-3 text-black">
          Log in
        </button>

        <span className="text-xs">
          Don't have account?{" "}
          <Link href="/signup" className="underline">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default LoginForm;
