"use client";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

const LoginForm = ({ login }: { login(data: any): Promise<void> }) => {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const res = await fetch("http://localhost:4130/login", {
    //   cache: "no-store",
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     name: text
    //   })
    // });

    const result = await signIn("credentials", {
      email: text,
      password,
      redirect: true,
      callbackUrl: "/"
    });

    setText("");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <form
        // action={login}
        // onSubmit={e => setText("")}
        onSubmit={submitHandler}
        className="flex flex-col items-center justify-center gap-4"
      >
        <input
          type="email"
          className="text-black"
          value={text}
          name="email"
          onChange={e => setText(e.target.value)}
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
