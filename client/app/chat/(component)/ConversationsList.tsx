"use client";
import { conversationName } from "@/app/utils";
import Link from "next/link";

const ConversationsList = ({ user }: { user: User }) => {
  const createConversation = async () => {
    // try {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/chat/conversations/create`,
    //     {
    //       cache: "no-store",
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       body: JSON.stringify({
    //         creator: user.id,
    //         participants: ["shine"]
    //       })
    //     }
    //   );
    //   if (!res.ok) {
    //     throw new Error("Couldn't create conversation.");
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  // console.log({ user });

  return (
    <div>
      <ul>
        {user.conversations?.map(c => (
          <li key={c.conversation.id} className="underline">
            <Link
              href={`/chat/${user.username}/conversation/${c.conversation.id}`}
            >
              {c.conversation.name
                ? conversationName(c.conversation.name, user.username)
                : ""}
            </Link>
          </li>
        ))}
      </ul>

      <button onClick={createConversation}>Add</button>
    </div>
  );
};

export default ConversationsList;
