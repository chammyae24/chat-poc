import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const client = new ApolloClient({
  uri: "http://localhost:4130/graphql",
  cache: new InMemoryCache()
});

type Props = {
  children: ReactNode;
};

export default function ApolloClientProvider({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
