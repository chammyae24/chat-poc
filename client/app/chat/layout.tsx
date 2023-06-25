"use client";
import { ReactNode } from "react";
import { SocketProvider } from "../context/SocketProvider";
import ConversationProvider from "../context/conversation-context/ConversationProvider";

type Props = {
  children: ReactNode;
};

const ChatLayout = ({ children }: Props) => {
  return (
    <ConversationProvider>
      <SocketProvider>{children}</SocketProvider>
    </ConversationProvider>
  );
};

export default ChatLayout;
