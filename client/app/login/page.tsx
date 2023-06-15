import { revalidatePath } from "next/cache";
import LoginForm from "./(component)/LoginForm";

async function login(data: FormData) {
  "use server";

  await fetch("http://localhost:4130/login", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: data.get("username")
    })
  });

  //   revalidatePath("/chat");
}

export default function LoginPage() {
  return (
    <div>
      <LoginForm login={login} />
    </div>
  );
}
