import {
  handleTextRequest,
  handleUrlRequest,
} from "./controllers/aiController";
import { errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";

dotenv.config();

const server = Bun.serve({
  port: 3000,
  fetch: async (req) => {
    try {
      const url = new URL(req.url);
      const method = req.method;

      if (method === "POST" && url.pathname === "/text") {
        return handleTextRequest(req);
      } else if (method === "POST" && url.pathname === "/url") {
        return handleUrlRequest(req);
      }

      return new Response(JSON.stringify({ message: "Endpoint not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return errorHandler(err);
    }
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
