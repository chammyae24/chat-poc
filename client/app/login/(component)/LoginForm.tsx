"use client";
import { FormEvent, useState } from "react";

const LoginForm = ({ login }: { login(data: any): Promise<void> }) => {
  const [text, setText] = useState("");

  //   const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();

  //     const res = await fetch("http://localhost:4130/login", {
  //       cache: "no-store",
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         name: text
  //       })
  //     });

  //     setText("");
  //   };

  return (
    <div>
      <form
        action={login}
        onSubmit={e => setText("")}
        // onSubmit={submitHandler}
      >
        <input
          type="text"
          className="text-black"
          value={text}
          name="username"
          onChange={e => setText(e.target.value)}
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default LoginForm;
