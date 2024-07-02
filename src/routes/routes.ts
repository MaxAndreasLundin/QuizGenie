import {
  handleTextRequest,
  handleUrlRequest,
} from "../controllers/aiController";
import { errorHandler } from "../middlewares/errorHandler";

export async function fetchHandler(req: Request): Promise<Response> {
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
}
