import { PrismaClient, user } from "@prisma/client";
import { Pubsub } from "../yoga";

export type GraphQLContext = {
  prisma: PrismaClient;
  authUser: null | user;
  pubsub: Pubsub;
};
