"use client";
import { FormEvent, useState } from "react";

const SignUpForm = ({
  signUp
}: {
  signUp: (data: FormData) => Promise<void>;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    setEmail("");
    setPassword("");
    setUsername("");
    setConfirmPassword("");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <form
        action={signUp}
        onSubmit={submitHandler}
        className="flex flex-col items-center justify-center gap-4"
      >
        <input
          type="text"
          className="text-black"
          placeholder="username"
          value={username}
          name="username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="email"
          className="text-black"
          value={email}
          name="email"
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          className="text-black"
          value={password}
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="confirm-password"
          className="text-black"
          value={confirmPassword}
          placeholder="confirm-password"
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="rounded bg-white px-6 py-3 text-black">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
