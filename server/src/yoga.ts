import { makeExecutableSchema } from "@graphql-tools/schema";
import { YogaInitialContext, createPubSub, createYoga } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import { typeDefs, resolvers } from "./graphql";

import { JwtPayload, verify } from "jsonwebtoken";
import { GraphQLContext } from "./graphql/types";

const prisma = new PrismaClient();
const pubsub = createPubSub();
export type Pubsub = typeof pubsub;

async function createContext(
  initCtx: YogaInitialContext
): Promise<GraphQLContext> {
  try {
    const header = initCtx.request.headers.get("authorization");
    if (!header) {
      throw new Error("No authorization header.");
    }
    const token = header.split(" ")[1];
    const tokenPayload = verify(token, process.env.SECRET_KEY!) as JwtPayload;

    const userId = tokenPayload.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    return { prisma, authUser: user, pubsub };
  } catch (err) {
    return { prisma, authUser: null, pubsub };
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export const yoga = createYoga({
  schema,
  context: createContext,
  graphiql: {
    subscriptionsProtocol: "WS"
  }
});
