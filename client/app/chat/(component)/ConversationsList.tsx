"use client";
import { MouseEvent } from "react";

const ConversationsList = ({ user }: { user: User }) => {
  const createConversation = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await fetch(
        `${process.env.API_URL}/chat/conversations/create`,
        {
          cache: "no-store",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            creator: user.id,
            participants: ["shine"]
          })
        }
      );

      if (!res.ok) {
        throw new Error("Couldn't create conversation.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <h1>Hi</h1>

      <ul>
        {user.contact.map(c => (
          <li key={c.id}>{c.email}</li>
        ))}
      </ul>

      <button onClick={createConversation}>Add</button>
    </div>
  );
};

export default ConversationsList;
