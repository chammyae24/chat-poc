"use client";
import { useSetSocket, useSocket } from "@/app/context/SocketProvider";
import {
  useConversations,
  useSetConversations
} from "@/app/context/conversation-context/ConversationProvider";
import { conversationName, groupSuccessive } from "@/app/utils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { FormEvent, Fragment, useCallback, useEffect, useRef } from "react";

type Props = {
  conversation: Conversations;
};

const sentTime = (time: string) => {
  const hours = new Date(time).getHours();
  const minutes = new Date(time).getMinutes();
  const day = new Date(time).toString().split(" ")[0];

  return `Sent ${day} at ${hours % 12 ? hours % 12 : 12}:${minutes} ${
    hours > 12 ? "pm" : "am"
  }`;
};

const lastMessageRef = (node: HTMLLIElement) => {
  if (node) {
    node.scrollIntoView({
      behavior: "smooth"
    });
  }
};

const Conversation = ({ conversation }: Props) => {
  const params = useParams();

  const msgInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();
  const { setId } = useSetSocket();
  const socket = useSocket();

  const setConversations = useSetConversations();
  const messages = useConversations(params.id);

  useEffect(() => {
    if (typeof params?.id === "string") {
      setId(params.id);
    }
  }, [params?.id, session?.user.accessToken, setId]);

  useEffect(() => {
    // console.log({ messages });

    if (conversation.messages && !messages) {
      setConversations(prev => {
        return { ...prev, [params.id]: conversation.messages ?? [] };
      });
    }

    return () => {
      // console.log("cleaning");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connect");
      });

      socket.on("message-accept", message => {
        setConversations(prev => {
          return { ...prev, [params.id]: [...prev[params.id], message] };
        });
      });

      socket.on("test", msg => {
        console.log(msg);
      });
    }

    return () => {
      socket?.off("message-accept");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket?.id]);

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

            setConversations(prev => {
              return {
                ...prev,
                [params.id]: [...prev[params.id], data.message]
              };
            });

            msgInputRef.current.value = "";
          } else {
            throw new Error("Res is not OK.");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.user.accessToken, socket?.id, params.id]
  );

  return (
    <div className="mx-auto flex h-[calc(100vh-24px-2rem)] w-2/3 flex-col justify-between border border-purple-600 p-2">
      <div className=" mb-4 min-h-[40px] rounded bg-purple-600 px-3 py-2">
        {conversation.name && session?.user.name
          ? conversationName(conversation.name, session.user.name)
          : ""}
      </div>
      {/* sub 1 rem because header is 40px and padding y 1 rem */}
      <div className="flex max-h-[calc(100%-40px-1rem)] flex-col">
        <ul className="grid grid-flow-row auto-rows-min gap-1 overflow-auto rounded">
          {groupSuccessive(messages ?? []).map(
            (messageArr, index, originalArr) => (
              <Fragment key={index}>
                {messageArr.map((message, index2) => {
                  const isFirstMsg = index2 === 0;
                  const isLastMsg = messageArr.length - 1 === index2;
                  const isSender = message.sender.username === params?.name;
                  return (
                    <li
                      key={message.id}
                      ref={
                        originalArr.length - 1 === index ? lastMessageRef : null
                      }
                      className={`relative flex flex-col self-end ${
                        isLastMsg ? "pb-4" : ""
                      }`}
                    >
                      <p
                        className={`${
                          isSender
                            ? "self-end rounded-l-2xl bg-white text-black " +
                              `${isFirstMsg && "rounded-tr-2xl"} ${
                                isLastMsg && "rounded-br-2xl"
                              }`
                            : "self-start rounded-r-2xl bg-purple-600 " +
                              `${isFirstMsg && "rounded-tl-2xl"} ${
                                isLastMsg && "rounded-bl-2xl"
                              }`
                        } relative max-w-[75%] rounded px-3 py-2`}
                      >
                        {message.content}
                      </p>

                      {isLastMsg && (
                        <span
                          className={`absolute ${
                            isSender ? "right-0" : "left-0"
                          } bottom-0 text-xs text-gray-400`}
                        >
                          {sentTime(message.sent_at) +
                            " by " +
                            message.sender.username +
                            "."}
                        </span>
                      )}
                    </li>
                  );
                })}
              </Fragment>
            )
          )}
        </ul>

        <form className="mt-4 flex gap-4" onSubmit={onSent}>
          <input
            type="text"
            className="flex-grow rounded px-3 py-2 text-black outline outline-2 outline-purple-600"
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
    </div>
  );
};

export default Conversation;
