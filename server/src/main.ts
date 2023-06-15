import { makeExecutableSchema } from "@graphql-tools/schema";
import { createYoga, createPubSub } from "graphql-yoga";
import { createServer } from "http";

type Message = {
  id: number;
  user: string;
  content: string;
};

const messages: Message[] = [];

const pubsub = createPubSub();

const typeDefs = `
    type Message {
        id: ID!
        user: String!
        content: String!
    }

    type Query {
        messages: [Message!]
    }

    type Mutation {
        postMessage(user: String!, content: String!): ID!
    }

    type Subscription {
        messages: [Message!]
    }
`;

const resolvers = {
  Query: {
    messages: () => messages
  },
  Mutation: {
    postMessage(
      parent: any,
      { user, content }: { user: string; content: string }
    ): number {
      const id = messages.length;
      messages.push({
        id,
        user,
        content
      });

      return id;
    }
  },
  Subscription: {
    messages: {
      subscribe: () => pubsub.subscribe("messages"),
      resolve: (payload: any) => payload
    }
  }
};

const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefs]
});

function main() {
  const yoga = createYoga({ schema });
  const server = createServer(yoga);
  server.listen(3100, () => {
    console.info("Server is running on http://localhost:3100/graphql");
  });
}

main();
