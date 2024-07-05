import { apiRequestHandler } from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();

function setCorsHeaders(response: Response): Response {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

const server = Bun.serve({
  port: 3000,
  fetch: async (request: Request) => {
    if (request.method === "OPTIONS") {
      return setCorsHeaders(new Response(null, { status: 204 }));
    }

    let response = await apiRequestHandler(request);

    return setCorsHeaders(response);
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
