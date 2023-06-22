"use client";
import { useSetSocket, useSocket } from "@/app/context/SocketProvider";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Props = {
  conversation: Conversations;
};

const Conversation = ({ conversation }: Props) => {
  const params = useParams();
  const msgInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();
  const { setId } = useSetSocket();
  const socket = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (typeof params?.id === "string") {
      setId(params.id);
    }
  }, [params?.id, session?.user.accessToken]);

  const onSent = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
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
            if (!socket) throw new Error("No socket available.");
            const data = await res.json();
            socket.on("connect", () => {
              console.log("connect");
            });
            socket.emit("sent-message", data);

            setMessages(msgs => [...msgs, data.message]);

            msgInputRef.current.value = "";
          } else {
            throw new Error("Res is not OK.");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [session?.user.accessToken, socket?.id]
  );

  useEffect(() => {
    if (conversation.messages) {
      setMessages(conversation.messages);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connect");
      });

      socket.on("message-accept", message => {
        setMessages(msgs => [...msgs, message]);
      });

      socket.on("test", msg => {
        console.log(msg);
      });
    }

    return () => {
      socket?.off("message-accept");
    };
  }, [msgInputRef.current, socket?.id]);

  return (
    <div className="mx-auto flex h-screen w-2/3 flex-col justify-end border border-purple-600 p-2">
      <ul className="flex max-h-[calc(100vh-40px-2rem)]  flex-col gap-1  overflow-scroll">
        {messages.map((message, index) => {
          const isLastMessage = messages.length - 1 === index;
          return (
            <li
              key={message.id}
              className={`${
                message.sender.username === params?.name
                  ? "self-end"
                  : "self-start"
              } relative max-w-[75%] pb-4`}
            >
              <p
                className={`${
                  message.sender.username === params?.name
                    ? "self-end rounded bg-white text-black"
                    : "self-start rounded  bg-purple-600"
                } relative px-3 py-2`}
              >
                {message.content}
              </p>
              {isLastMessage && (
                <span
                  className={`absolute ${
                    message.sender.username === params?.name
                      ? "right-0"
                      : "left-0"
                  } bottom-0 text-xs text-purple-600`}
                >
                  {message.sender.username}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <form className=" mt-10 flex  gap-4" onSubmit={onSent}>
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
