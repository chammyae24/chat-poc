import { redirect } from "next/navigation";
import SignUpForm from "./(component)/SignUpForm";

async function signUp(data: FormData) {
  "use server";

  try {
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirm-password");
    if (password !== confirmPassword) {
      throw new Error("Invalid password.");
    }
    const res = await fetch(`${process.env.API_URL}/auth/signup`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        email
      })
    });
    if (!res.ok) {
      throw new Error("Could not sign up.");
    }

    redirect("/login");
  } catch (error) {
    if ((error as any).message === "NEXT_REDIRECT") {
      redirect("/login");
    }
    console.log(error);
  }
}

export default function SignUpPage() {
  return (
    <div>
      <div>
        <SignUpForm signUp={signUp} />
      </div>
    </div>
  );
}
