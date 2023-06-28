"use client";
import { ReactNode } from "react";
import { SocketProvider } from "../context/SocketProvider";
import ConversationProvider from "../context/conversation-context/ConversationProvider";

type Props = {
  children: ReactNode;
};

const ChatLayout = (props: Props) => {
  return (
    <ConversationProvider>
      <SocketProvider>{props.children}</SocketProvider>
    </ConversationProvider>
  );
};

export default ChatLayout;
