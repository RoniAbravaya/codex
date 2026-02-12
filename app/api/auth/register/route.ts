import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { handleRoute } from "@/lib/api/handle-route";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  return handleRoute(async () => {
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
