import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

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
  const testDb = await prisma.messages.findMany();

  //   console.log(testDb);

  io.on("connection", async socket => {
    console.log("a user connected");

    socket.on(
      "sendText",
      async ({ text, userId }: { text: string; userId: string }) => {
        try {
          await prisma.messages.create({
            data: {
              text,
              userId: parseInt(userId)
            }
          });

          const newTestDb = await prisma.messages.findMany();
          io.emit("sentFromDb", newTestDb);
        } catch (err) {
          console.log(err);
        }
      }
    );

    io.emit("sentFromDb", testDb);
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

app.post("/login", async (req, res) => {
  const { name } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      name: name
    }
  });

  if (user) {
    console.log(user);
    res.status(200).json(user);
  } else {
    console.log("No user found");
    res.status(404).json({ msg: "No user found" });
  }
});

app.get("/chat/:userId", async (req, res) => {
  //   console.log("test", req.params);

  const user = await prisma.user.findUnique({
    where: {
      id: +req.params.userId
    }
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(500).send({ message: "User not found" });
  }
});

server.listen(4130, () => {
  console.log("listening on *:4130");
});
