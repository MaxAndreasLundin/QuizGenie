import { apiRequestHandler } from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();

const server = Bun.serve({
  port: 3000,
  fetch: apiRequestHandler,
});

console.log(`Listening on http://localhost:${server.port} ...`);
