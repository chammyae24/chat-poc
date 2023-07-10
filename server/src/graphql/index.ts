import path from "path";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import userResolvers from "./resolvers/user";
import conversationResolvers from "./resolvers/conversation";
import messageResolvers from "./resolvers/message";
import contactResolvers from "./resolvers/contact";

const typesArray = loadFilesSync(path.join(__dirname, "./"), {
  extensions: ["graphql"]
});

export const typeDefs = mergeTypeDefs(typesArray);

export const resolvers = [
  userResolvers,
  conversationResolvers,
  messageResolvers,
  contactResolvers
];
