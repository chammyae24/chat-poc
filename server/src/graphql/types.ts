import { PrismaClient, user } from "@prisma/client";

export type GraphQLContext = {
  prisma: PrismaClient;
  authUser: null | user;
};
