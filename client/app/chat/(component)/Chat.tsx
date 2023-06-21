"use client";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import io from "socket.io-client";

// const socket = io(process.env.API_URL!);

type Props = {
  username: string;
};

const Chat = ({ username }: Props) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { data } = useSession();

  useEffect(() => {
    // socket.connect();
    // socket.on("connect", () => {
    //   console.log("Connected", socket.id);
    // });
    // const onSentEvent = (data: Message[]) => {
    //   console.log("updating");
    //   setMessages(data);
    // };
    // socket.on("sentFromDb", onSentEvent);
    // return () => {
    //   socket.off("sentFromDb", onSentEvent);
    //   socket.disconnect();
    // };
  }, []);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // socket.emit("sendText", { text, username });
    setText("");
  };

  return (
    <div>
      <div>
        <ul className="flex w-[600px] flex-col">
          {messages.map(message => (
            <li key={message.id}>{message.content}</li>
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
