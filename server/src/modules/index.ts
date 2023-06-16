import { Conversation, Message, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(
  username: string,
  password: string,
  email: string
): Promise<User> {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password,
        email
      }
    });
    console.log("User created:", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function createConversation(name?: string): Promise<Conversation> {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        name
      }
    });
    console.log("Conversation created:", conversation);
    return conversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
}

export async function createMessage(
  senderId: number,
  content: string,
  conversationId: number
): Promise<Message> {
  try {
    const message = await prisma.message.create({
      data: {
        content,
        sender: { connect: { id: senderId } },
        conversation: { connect: { id: conversationId } }
      }
    });
    console.log("Message created:", message);
    return message;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany();
    console.log("Users:", users);
    return users;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
}

export async function getConversations(): Promise<Conversation[]> {
  try {
    const conversations = await prisma.conversation.findMany();
    console.log("Conversations:", conversations);
    return conversations;
  } catch (error) {
    console.error("Error retrieving conversations:", error);
    throw error;
  }
}

export async function getMessages(): Promise<Message[]> {
  try {
    const messages = await prisma.message.findMany();
    console.log("Messages:", messages);
    return messages;
  } catch (error) {
    console.error("Error retrieving messages:", error);
    throw error;
  }
}
