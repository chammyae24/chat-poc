import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loadConversations(username: string) {
  const user = await prisma.user.findFirst({
    where: {
      username
    },
    include: {
      conversations: true
    }
  });

  return user?.conversations;
}
