"use client";
import { ReactNode } from "react";
import ConversationProvider from "../context/conversation-context/ConversationProvider";

type Props = {
  children: ReactNode;
};

const ChatLayout = (props: Props) => {
  return <ConversationProvider>{props.children}</ConversationProvider>;
};

export default ChatLayout;
