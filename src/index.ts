import { fetchHandler } from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();

const server = Bun.serve({
  port: 3000,
  fetch: fetchHandler,
});

console.log(`Listening on http://localhost:${server.port} ...`);
