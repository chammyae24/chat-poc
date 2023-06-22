import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { PrismaClient, user } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"]
  }
});
app.set("socketio", io);

const prisma = new PrismaClient();

async function main() {
  // const testDb = await prisma.userConversation.findMany();
  // console.log(testDb);
  // io.on("connection", async socket => {
  //   console.log("a user connected", socket.id);
  //   socket.on(
  //     "sendText",
  //     async ({ text, userId }: { text: string; userId: string }) => {
  //       // try {
  //       //   await prisma.message.create({
  //       //     data: {
  //       //       content: text,
  //       //       userId: parseInt(userId)
  //       //     }
  //       //   });
  //       //   const newTestDb = await prisma.message.findMany();
  //       //   socket.emit("sentFromDb", newTestDb);
  //       // } catch (err) {
  //       //   console.log(err);
  //       // }
  //     }
  //   );
  //   socket.emit("sentFromDb", testDb);
  // });

  io.on("connection", socket => {
    console.log("connect");

    // This is conversation id and access token
    const { id, token } = socket.handshake.query;
    socket.join(id as string);

    // console.log({ id, token });
    socket.on("sent-message", message => {
      console.log("Sent message");

      console.log({ message });

      socket.broadcast.to(id as string).emit("message-accept", message.message);
    });

    socket.on("test", msg => {
      // console.log({ msg, id });

      socket.to(id as string).emit("test", msg);
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username }
    });
    if (!user) {
      res.status(404).json({ message: "Invalid email or password." });
      return;
    }

    const isValidPassword = await bcrypt.compare(user.password, password);
    if (isValidPassword) {
      res.status(404).json({ message: "Invalid email or password." });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY!);

    // ? sent username as name because Next-Auth session.user has name, email and image only
    res.status(200).json({
      message: "User exists.",
      user: { ...user, name: username, token }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: {
          username,
          email
        }
      }
    });

    if (user) {
      res.status(409).json({ message: "User already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username
      }
    });

    res.status(201).json({ message: "User Signed Up Successfully." });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/chat/:username", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      username: req.params.username
    },
    select: {
      id: true,
      username: true,
      email: true,
      created_at: true,
      conversations: {
        select: {
          conversation: true
        }
      }
    }
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

app.post("/chat/conversations/create", async (req, res) => {
  try {
    const { name, participants } = req.body;
    // ! DON'T DELETE THIS
    // await prisma.user_conversation.deleteMany();
    // await prisma.conversation.deleteMany();

    const participantIds = await prisma.user.findMany({
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
        name: name ? name : participantIds.map(p => p.username).join()
      }
    });

    const data = participantIds.map(participant => ({
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
      include: {
        participants: true,
        messages: true
      }
    });

    res.status(200).json({ conversation });
  } catch (err) {
    res.status(500).send({ err });
  }
});

app.get("/chat/conversation/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await prisma.conversation.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        created_at: true,
        name: true,
        messages: {
          select: {
            sent_at: true,
            content: true,
            id: true,
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

    res.status(200).json({ conversation });
  } catch (err) {
    res.status(500).send({ err });
  }
});

app.post("/chat/conversation/message/create", async (req, res) => {
  try {
    const { token, conversationId, content } = req.body;

    const { id: senderId } = jwt.verify(token, process.env.SECRET_KEY!) as {
      id: string;
      iat: number;
    };

    const message = await prisma.message.create({
      data: {
        content,
        sender_id: senderId,
        conversation_id: conversationId
      },
      include: {
        conversation: true,
        sender: true
      }
    });

    res.status(200).send({ msg: "Ok", senderId, conversationId, message });
  } catch (err) {
    res.status(500).send({ err });
  }
});

server.listen(4130, () => {
  console.log("listening on *:4130");
});
