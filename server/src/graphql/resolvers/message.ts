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
        const { authUser, prisma, pubsub } = context;
        const { conversation_id, content } = args;

        if (!authUser) {
          throw new GraphQLError("Not authenticated.");
        }

        //! TESTING
        // ? Checck if auth user is in conversation
        const test = await prisma.user_conversation.findFirst({
          where: {
            user_id: authUser.id
          },
          select: {
            conversation_id: true
          }
        });

        if (!test) {
          throw new GraphQLError("No conversation.");
        }
        if (test.conversation_id !== conversation_id) {
          throw new GraphQLError("You don't belong to this conversation.");
        }
        // !

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

        //! TESTING
        // ? update last message
        await prisma.conversation.update({
          data: {
            lastMsgId: message.id
          },
          where: {
            id: conversation_id
          }
        });
        // !

        pubsub.publish("message", { message });

        return message;
      } catch (err: any) {
        throw new GraphQLError(err.message);
      }
    }
  },
  Subscription: {
    message: {
      subscribe: (_: unknown, args: {}, context: GraphQLContext) =>
        context.pubsub.subscribe("message")
    }
  }
};

export default resolvers;
