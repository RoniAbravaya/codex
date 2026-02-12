import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { handleRoute } from "@/lib/api/handle-route";
import { registerSchema } from "@/lib/validation/auth";
import { AppError } from "@/lib/tenancy/errors";

export async function POST(request: Request) {
  return handleRoute(async () => {
    if (!process.env.DATABASE_URL) {
      throw new AppError("Service unavailable", 503);
    }

    const body = await request.json();
    const input = registerSchema.parse(body);

    const exists = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } });
    if (exists) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const passwordHash = await hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash
      },
      select: { id: true, email: true, name: true }
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  });
}
