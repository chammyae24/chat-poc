import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { GraphQLContext } from "../types";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    login: async (
      _: unknown,
      args: { username: string; password: string },
      context: GraphQLContext
    ) => {
      try {
        const { prisma } = context;
        const { username, password } = args;

        const user = await prisma.user.findUnique({
          where: {
            username
          }
        });
        if (!user) {
          throw new GraphQLError("Invalid username or password.");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new GraphQLError("Invalid username or password.");
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY!);

        return {
          ...user,
          name: username,
          token
        };
      } catch (err: any) {
        // console.log({ err });
        throw new GraphQLError(err.message);
      }
    },
    getLoginUser: async (_: unknown, __: {}, context: GraphQLContext) => {
      try {
        const { authUser, prisma } = context;

        if (!authUser) {
          throw new GraphQLError("Not authenticated.");
        }

        const user = await prisma.user.findUnique({
          where: {
            id: authUser.id
          },
          select: {
            id: true,
            username: true,
            email: true,
            created_at: true,
            conversations: {
              select: {
                conversation: {
                  select: {
                    id: true,
                    name: true,
                    lastMessage: {
                      select: {
                        id: true,
                        content: true
                      }
                    }
                  }
                }
              }
            },
            contacts: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        });

        if (!user) {
          throw new GraphQLError("User not found.");
        }

        return user;
      } catch (err: any) {
        throw new GraphQLError(err.message);
      }
    }
  },
  Mutation: {
    signUp: async (
      _: unknown,
      args: { username: string; email: string; password: string },
      context: GraphQLContext
    ) => {
      try {
        const { prisma } = context;
        const { username, email, password } = args;

        const user = await prisma.user.findFirst({
          where: {
            OR: {
              username,
              email
            }
          }
        });
        if (user) {
          throw new GraphQLError("User already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username
          }
        });

        return { message: "User signed up successfully." };
      } catch (err: any) {
        // console.log({ err });
        throw new GraphQLError(err.message);
      }
    },
    randomNumber: (_: unknown, __: {}, context: GraphQLContext) => {
      const rdNum = Math.random();
      context.pubsub.publish("randomNumber", { randomNumber: rdNum });
      return rdNum;
    }
  }
};

export default resolvers;
