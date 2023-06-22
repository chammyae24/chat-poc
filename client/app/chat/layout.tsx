"use client";
import { ReactNode } from "react";
import { SocketProvider } from "../context/SocketProvider";

type Props = {
  children: ReactNode;
};

const ChatLayout = ({ children }: Props) => {
  return <SocketProvider>{children}</SocketProvider>;
};

export default ChatLayout;
