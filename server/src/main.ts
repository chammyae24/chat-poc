import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

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
  const testDb = await prisma.userConversation.findMany();

  console.log(testDb);

  io.on("connection", async socket => {
    console.log("a user connected", socket.id);

    socket.on(
      "sendText",
      async ({ text, userId }: { text: string; userId: string }) => {
        // try {
        //   await prisma.message.create({
        //     data: {
        //       content: text,
        //       userId: parseInt(userId)
        //     }
        //   });
        //   const newTestDb = await prisma.message.findMany();
        //   socket.emit("sentFromDb", newTestDb);
        // } catch (err) {
        //   console.log(err);
        // }
      }
    );

    socket.emit("sentFromDb", testDb);
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
  const { email, password } = req.body;

  // console.log(email, password);

  // ! THIS IS NOT IDEAL WAY
  const user = await prisma.user.findMany({
    where: {
      AND: {
        email,
        password
      }
    }
  });

  if (user.length > 0) {
    // console.log(user);
    const token = jwt.sign({ id: user[0].id }, "chammyae");
    res.status(200).json({ ...user[0], token, name: user[0].username });
  } else {
    console.log("No user found");
    res.status(404).json({ msg: "No user found" });
  }
});

app.get("/chat/:userId", async (req, res) => {
  //   console.log("test", req.params);

  const user = await prisma.user.findUnique({
    where: {
      // id: +req.params.userId
      username: req.params.userId
    }
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

server.listen(4130, () => {
  console.log("listening on *:4130");
});
