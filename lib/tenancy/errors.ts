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
  return new AppError("Internal server error", 500);
}
