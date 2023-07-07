import userResolvers from "./user";
import conversationResolvers from "./conversation";
import messageResolvers from "./message";
import contactResolvers from "./contact";

export const resolvers = [
  userResolvers,
  conversationResolvers,
  messageResolvers,
  contactResolvers
];
