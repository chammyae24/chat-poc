import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";
import splitLink from "./graphqlWs";

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

type Props = {
  children: ReactNode;
};

export default function ApolloClientProvider({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
