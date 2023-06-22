import { PrismaClient, user } from "@prisma/client";
import { createPubSub } from "graphql-yoga";
import { Pubsub } from "../yoga";

const pubsub = createPubSub();

export type GraphQLContext = {
  prisma: PrismaClient;
  authUser: null | user;
  pubsub: Pubsub;
};
