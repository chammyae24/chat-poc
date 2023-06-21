"use client";
import { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

const ChatLayout = ({ children }: Props) => {
  return <>{children}</>;
};

export default ChatLayout;
