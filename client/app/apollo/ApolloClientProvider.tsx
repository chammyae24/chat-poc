"use client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";
import splitLink from "./graphqlWs";

// eslint-disable-next-line react-refresh/only-export-components
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

type Props = {
  children: ReactNode;
};

// console.log("test", { wd });

export default function ApolloClientProvider({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
