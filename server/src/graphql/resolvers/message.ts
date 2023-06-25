import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "../types";

const resolvers = {
  Mutation: {
    sendMessage: async (
      _: unknown,
      args: { conversation_id: string; content: string },
      context: GraphQLContext
    ) => {
      try {
        const { authUser, prisma } = context;
        const { conversation_id, content } = args;

        if (!authUser) {
          throw new GraphQLError("Not authenticated.");
        }

        const message = await prisma.message.create({
          data: {
            content,
            conversation_id,
            sender_id: authUser.id
          },
          select: {
            id: true,
            content: true,
            sent_at: true,
            conversation_id: true,
            sender: {
              select: {
                id: true,
                username: true
              }
            }
          }
        });

        if (!message) {
          throw new GraphQLError("Cannot create message.");
        }

        return message;
      } catch (err: any) {
        throw new GraphQLError(err.message);
      }
    }
  }
};

export default resolvers;
