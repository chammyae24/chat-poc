import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loadConversations(username: string) {
  // const user = await prisma.user.findFirst({
  //   where: {
  //     username
  //   },
  //   include: {
  //     conversations: true
  //   }
  // });
  const user = await prisma.user.findFirst({
    where: {
      username
    },
    include: {
      conversations: {
        select: {
          conversation: true
        }
      }
    }
  });

  console.log(user);

  // const test = await prisma.user_conversation.findUnique({
  //   where: {

  //   }
  // });

  return user?.conversations;
}
