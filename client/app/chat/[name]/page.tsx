import React from "react";
import ConversationsList from "../(component)/ConversationsList";

type Props = {
  params: { name: string };
};

export default async function ChatPage({ params }: Props) {
  try {
    const res = await fetch(`${process.env.API_URL}/chat/${params.name}`, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error("Could not found user");
    }

    const user = await res.json();

    return (
      <div>
        <ConversationsList user={user} />
      </div>
    );
  } catch (e) {
    console.log(e);

    return (
      <div>
        <div>No User</div>
      </div>
    );
  }
}
