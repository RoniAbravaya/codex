import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export function toAppError(error: unknown) {
  if (error instanceof AppError) return error;

  if (error instanceof ZodError) {
    return new AppError("Invalid request payload", 400);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return new AppError("Resource already exists", 409);
    }

    // Most common when Prisma schema changed (e.g. passwordHash added) but DB migration not applied.
    if (error.code === "P2022") {
      return new AppError("Database schema is out of date. Run prisma migrations.", 503);
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new AppError("Database is not available", 503);
  }

  return new AppError("Internal server error", 500);
}
