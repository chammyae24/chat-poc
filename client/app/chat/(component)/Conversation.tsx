"use client";
import {
  useConversations,
  useSetConversations
} from "@/app/context/conversation-context/ConversationProvider";
import { conversationName, groupSuccessive } from "@/app/utils";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { FormEvent, Fragment, useCallback, useEffect, useRef } from "react";

type Props = {
  conversation: Conversations;
};

const sentTime = (time: string) => {
  const timeInt = parseInt(time);
  const hours = new Date(timeInt).getHours();
  const minutes = new Date(timeInt).getMinutes();
  const day = new Date(timeInt).toString().split(" ")[0];

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

const SEND_MESSAGE = gql`
  mutation TestMutable($cid: String!, $content: String!) {
    sendMessage(conversation_id: $cid, content: $content) {
      id
      content
      sent_at
      conversation_id
      sender {
        id
        username
      }
    }
  }
`;

const MESSAGE_SUB = gql`
  subscription {
    message {
      id
      content
      sent_at
      conversation_id
      sender {
        id
        username
      }
    }
  }
`;

const Conversation = ({ conversation }: Props) => {
  const params = useParams();

  const msgInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const { data, error } = useSubscription(MESSAGE_SUB);

  const setConversations = useSetConversations();
  const messages = useConversations(params.id);

  useEffect(() => {
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
    console.log({ error, data });
    if (data) {
      setConversations(prev => {
        return {
          ...prev,
          [params.id]: [...prev[params.id], data?.message as Message]
        };
      });
    }

    if (error) {
      console.log(error);
    }
  }, [data, error, params.id, setConversations]);

  const onSent = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if (msgInputRef.current) {
          await sendMessage({
            context: {
              headers: {
                Authorization: `Bearer ${session?.user.accessToken}`
              }
            },
            variables: {
              cid: params?.id,
              content: msgInputRef.current.value
            }
          });

          msgInputRef.current.value = "";
        }
      } catch (err) {
        console.log(err);
      }
    },

    [params?.id, sendMessage, session?.user.accessToken]
  );

  return (
    <div className="mx-auto flex h-[calc(100vh-24px-2rem)] w-2/3 flex-col justify-between border border-purple-600 bg-black p-2">
      <div className=" mb-4 min-h-[40px] rounded bg-purple-600 px-3 py-2">
        {conversation.name && session?.user.name
          ? conversationName(conversation.name, session.user.name)
          : ""}
      </div>
      {/* sub 1 rem because header is 40px and padding y 1 rem */}
      <div className="messages-container relative flex max-h-[calc(100%-40px-1rem)] flex-col">
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
                            ? "relative z-10 self-end rounded-l-2xl bg-white text-black " +
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
                          className={`absolute z-10 ${
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
