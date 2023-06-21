"use client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { FormEvent, useRef } from "react";

type Props = {
  conversation: Conversations;
};

const Conversation = ({ conversation }: Props) => {
  const params = useParams();
  const msgInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  const onSent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (msgInputRef.current) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/conversation/message/create`,
          {
            cache: "no-store",
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              token: session?.user.accessToken,
              conversationId: params?.id,
              content: msgInputRef.current.value
            })
          }
        );

        if (res.ok) {
        }
        msgInputRef.current.value = "";
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ul className="mx-auto flex w-2/3 flex-col gap-6">
        {conversation.messages?.map(message => (
          <li
            key={message.id}
            className={`${
              message.sender.username === params?.name
                ? "self-end rounded bg-white text-black"
                : "self-start rounded  bg-purple-600"
            } relative px-3 py-2`}
          >
            {message.content}
            <span
              className={`absolute ${
                message.sender.username === params?.name ? "right-0" : "left-0"
              } top-full text-xs text-purple-600`}
            >
              {message.sender.username}
            </span>
          </li>
        ))}
      </ul>

      <form className="mx-auto mt-10 flex w-2/3 gap-4" onSubmit={onSent}>
        <input
          type="text"
          className="flex-grow rounded px-3 py-2 text-black"
          ref={msgInputRef}
        />
        <button
          type="submit"
          className="rounded bg-purple-600 px-3 py-2 text-white"
        >
          send
        </button>
      </form>
    </div>
  );
};

export default Conversation;
