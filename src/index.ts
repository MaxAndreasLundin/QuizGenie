import { handleTextRequest } from "./controllers/aiController";
import { errorHandler } from "./middlewares/errorHandler";
import CustomResponse from "./utils/customResponse";
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
      }

      return new CustomResponse(
        { message: "Endpoint not found" },
        { status: 404 }
      );
    } catch (err) {
      return errorHandler(err as Error);
    }
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
