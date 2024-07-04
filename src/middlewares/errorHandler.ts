import { JsonResponse } from "../utils/customResponse";

export function errorHandler(err: Error) {
  console.error(err);
  return new JsonResponse(
    { message: "Internal Server Error" },
    { status: 500 }
  );
}
