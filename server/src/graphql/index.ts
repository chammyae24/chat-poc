import { makeExecutableSchema } from "@graphql-tools/schema";
import { createSchema, createYoga } from "graphql-yoga";
import { PrismaClient, user } from "@prisma/client";

const prisma = new PrismaClient();

type GraphQLContext = {
  prisma: PrismaClient;
};

function createContext(): GraphQLContext {
  return { prisma };
}

const typeDefs = /* GraphQL */ `
  type Query {
    info: String
    users: [User]
    user(username: String): User
  }

  type User {
    id: String
    username: String
    password: String
    email: String
  }
`;

const resolvers = {
  Query: {
    info: () => "Text",
    users: (parent: unknown, args: {}, context: GraphQLContext) =>
      context.prisma.user.findMany(),
    user: async (
      parent: unknown,
      args: { username: string },
      context: GraphQLContext
    ) => {
      const user = await context.prisma.user.findUnique({
        where: {
          username: args.username
        }
        // select: {
        //   id: true,
        //   username: true,
        //   email: true,
        //   password: true
        // }
      });

      return user;
    }
  }
  // ,User: {
  //   id: (parent: user) => parent.id,
  //   username: (parent: user) => parent.username,
  //   email: (parent: user) => parent.email,
  //   password: (parent: user) => parent.password
  // }
};

const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: [resolvers]
});

export const yoga = createYoga({
  schema,
  context: createContext
});
