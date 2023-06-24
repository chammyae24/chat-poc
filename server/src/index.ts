import { makeExecutableSchema } from "@graphql-tools/schema";
import { YogaInitialContext, createYoga } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { JwtPayload, verify } from "jsonwebtoken";
import { GraphQLContext } from "./graphql/types";

const prisma = new PrismaClient();

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
    return { prisma, authUser: user };
  } catch (err) {
    // console.log({ err });
    return { prisma, authUser: null };
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export const yoga = createYoga({
  schema,
  context: createContext
});
