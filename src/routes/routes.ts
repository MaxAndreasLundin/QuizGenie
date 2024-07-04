import {
  generateQuizFromText,
  generateQuizFromUrl,
} from "../controllers/aiController";
import { errorHandler } from "../middlewares/errorHandler";

type Route = {
  method: string;
  path: string;
  handler: (req: Request) => Promise<Response>;
};

const routes: Route[] = [
  { method: "POST", path: "/text", handler: generateQuizFromText },
  { method: "POST", path: "/url", handler: generateQuizFromUrl },
];

function createNotFoundResponse(): Response {
  return new Response(JSON.stringify({ message: "Endpoint not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

export async function apiRequestHandler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const method = req.method;

    const route = routes.find(
      (r) => r.method === method && r.path === url.pathname
    );

    if (route) {
      return route.handler(req);
    }

    return createNotFoundResponse();
  } catch (err) {
    return errorHandler(err as Error);
  }
}
