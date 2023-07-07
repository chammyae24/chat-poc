import { GraphQLError } from "graphql";
import { GraphQLContext } from "../types";

const resolvers = {
  Query: {
    getConversation: async (
      _: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      try {
        const { authUser, prisma } = context;
        const { id } = args;

        if (!authUser) {
          throw new GraphQLError("Not authenticated.");
        }

        const conversation = await prisma.conversation.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
            messages: {
              select: {
                id: true,
                content: true,
                sent_at: true,
                sender: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        });

        return conversation;
      } catch (err: any) {
        throw new GraphQLError(err.message);
      }
    }
  },
  Mutation: {
    createConversation: async (
      _: unknown,
      args: { name: string; participants: string[] },
      context: GraphQLContext
    ) => {
      try {
        const { authUser, prisma } = context;

        if (!authUser) {
          throw new GraphQLError("Not authenticated.");
        }
        // ! participants Should be ID array
        const { name, participants } = args;

        const participantTds = await prisma.user.findMany({
          where: {
            username: {
              in: participants
            }
          },
          select: {
            id: true,
            username: true
          }
        });

        const createdConversation = await prisma.conversation.create({
          data: {
            name: name ? name : participantTds.map(p => p.username).join()
          }
        });
        const data = participantTds.map(participant => ({
          conversation_id: createdConversation.id,
          user_id: participant.id
        }));
        await prisma.user_conversation.createMany({
          data
        });

        const conversation = await prisma.conversation.findUnique({
          where: {
            id: createdConversation.id
          },
          select: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
            messages: {
              select: {
                id: true,
                content: true,
                sent_at: true,
                sender: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        });

        return conversation;
      } catch (err: any) {
        throw new GraphQLError(err.message);
      }
    }
  }
};

export default resolvers;
