import React from "react";
import Chat from "../(component)/Chat";

type Props = {
  params: { id: string };
};

export default async function ChatPage({ params }: Props) {
  const res = await fetch(`http:///localhost:4130/chat/${params.id}`, {
    cache: "no-store"
  });

  if (res.status !== 200) {
    return (
      <div>
        <div>No User</div>
      </div>
    );
  }

  return (
    <div>
      <Chat userId={params.id} />
    </div>
  );
}
