"use client";
import { useCallback, useRef } from "react";

const SignUpForm = ({
  signUp
}: {
  signUp: (data: FormData) => Promise<{ error: unknown }>;
}) => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  console.log("updating");

  const signUpAction = useCallback(async (data: FormData) => {
    const { error } = await signUp(data);

    alert(error);
    console.log(error);

    /* eslint-disable */
    // usernameRef.current!.value = "";
    // emailRef.current!.value = "";
    // passwordRef.current!.value = "";
    // confirmPasswordRef.current!.value = "";
  }, []);
  /* eslint-enable */

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <form
        action={signUpAction}
        className="flex flex-col items-center justify-center gap-4"
      >
        <input
          type="text"
          className="text-black"
          placeholder="username"
          name="username"
          ref={usernameRef}
        />
        <input
          type="email"
          className="text-black"
          name="email"
          placeholder="email"
          ref={emailRef}
        />
        <input
          type="password"
          name="password"
          className="text-black"
          placeholder="password"
          ref={passwordRef}
        />
        <input
          type="password"
          name="confirm-password"
          className="text-black"
          placeholder="confirm-password"
          ref={confirmPasswordRef}
        />
        <button type="submit" className="rounded bg-white px-6 py-3 text-black">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
