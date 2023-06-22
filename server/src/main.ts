import express from "express";
import http from "http";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { yoga } from "./yoga";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const app = express();
app.use(express.json());
app.use("/graphql", yoga);
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);
const server = http.createServer(app);

const wsServer = new WebSocketServer({
  server,
  path: yoga.graphqlEndpoint
});

console.log({ endpoint: yoga.graphqlEndpoint });

useServer(
  {
    execute: (args: any) => args.rootValue.execute(args),
    subscribe: (args: any) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload
        });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe
        }
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    }
  },
  wsServer
);

const prisma = new PrismaClient();

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

server.listen(4130, () => {
  console.log("GraphiQL on http://localhost:4130/graphql");
});
