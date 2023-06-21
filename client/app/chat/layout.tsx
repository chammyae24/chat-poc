"use client";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ChatLayout = ({ children }: Props) => {
  return <>{children}</>;
};

export default ChatLayout;
