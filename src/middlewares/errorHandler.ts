import CustomResponse from "../utils/customResponse";

export function errorHandler(err: Error) {
  console.error(err);
  return new CustomResponse(
    { message: "Internal Server Error" },
    { status: 500 }
  );
}
