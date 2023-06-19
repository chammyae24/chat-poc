import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { PrismaClient, user } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { loadConversations } from "./modules/chat";

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
    origin: "http://localhost:3000"
  }
});

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
  const user = await prisma.user.findUnique({
    where: {
      username: req.params.username
    }
  });

  const contact = await prisma.user.findMany({
    where: {
      NOT: {
        id: user?.id
      }
    }
  });

  if (user) {
    const conversations = await loadConversations(user.username);
    console.log(conversations);

    res.status(200).json({ ...user, conversations, contact });
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

app.post("/chat/conversations/create", async (req, res) => {
  try {
    const { name, participants } = req.body;

    // ! DON'T DELETE THIS
    await prisma.user_conversation.deleteMany();
    await prisma.conversation.deleteMany();

    const createdConversation = await prisma.conversation.create({
      data: {
        name: name ? name : null
      }
    });

    const data = await participants.map((participant: string) => ({
      conversation_id: createdConversation.id,
      user_id: participant
    }));

    await prisma.user_conversation.createMany({
      data
    });

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: createdConversation.id
      },
      include: {
        participants: true
      }
    });

    res.status(200).json({ conversation });
  } catch (err) {
    res.status(500).send({ err });
  }
});

server.listen(4130, () => {
  console.log("listening on *:4130");
});
