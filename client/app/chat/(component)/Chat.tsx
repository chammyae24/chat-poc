"use client";
import { FormEvent, useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4130");

type Message = {
  id: number;
  text: string;
  createdAt: string;
  userId: number;
};

type Props = {
  userId: string;
};

const Chat = ({ userId }: Props) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected", socket.id);
    });

    const onSentEvent = (data: Message[]) => {
      console.log("updating");

      setMessages(data);
    };

    socket.on("sentFromDb", onSentEvent);

    return () => {
      socket.off("sentFromDb", onSentEvent);
      socket.disconnect();
    };
  }, []);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("sendText", { text, userId });
    setText("");
  };

  return (
    <div>
      <div>
        <ul className="flex flex-col w-[600px]">
          {messages.map(message => (
            <li
              key={message.id}
              className={`${
                parseInt(userId) === message.userId
                  ? "text-white self-start"
                  : "text-green-600 self-end"
              }`}
            >
              {message.text}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            className="text-black"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button type="submit">send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
