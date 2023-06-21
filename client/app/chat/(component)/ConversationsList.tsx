"use client";
import Link from "next/link";
import { MouseEvent, useEffect } from "react";

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
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Hi</h1>

      <ul>
        {user.conversations?.map(c => (
          <li key={c.conversation.id} className="underline">
            <Link
              href={`/chat/${user.username}/conversation/${c.conversation.id}`}
            >
              {c.conversation.name}
            </Link>
          </li>
        ))}
      </ul>

      <button onClick={createConversation}>Add</button>
    </div>
  );
};

export default ConversationsList;
