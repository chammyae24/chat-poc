import { GraphQLError } from "graphql";
import { GraphQLContext } from "../types";

const resolvers = {
  Mutation: {
    addContact: async (
      _: unknown,
      args: { contactUsername: string },
      context: GraphQLContext
    ) => {
      try {
        const { authUser, prisma } = context;
        const { contactUsername: username } = args;

        if (!authUser) {
          throw new GraphQLError("Not authenticated.");
        }

        const user = await prisma.user.findUnique({
          where: { username },
          select: {
            id: true,
            email: true,
            username: true
          }
        });

        if (!user) {
          throw new GraphQLError("User not found.");
        }

        const contact = await prisma.contact.create({
          data: {
            contactOwnerId: authUser.id,
            email: user.email,
            userId: user.id,
            username: user.username
          }
        });

        return contact;
      } catch (err: any) {
        throw new GraphQLError(err.message);
      }
    }
  }
};

export default resolvers;
