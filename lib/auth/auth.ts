import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { credentialsSchema } from "@/lib/validation/auth";

async function bootstrapWorkspace(userId: string, userName?: string | null) {
  const existing = await prisma.membership.findFirst({ where: { userId } });
  if (existing) return;

  const workspace = await prisma.workspace.create({
    data: {
      name: `${userName ?? "My"} Workspace`,
      ownerId: userId,
      memberships: {
        create: { userId, role: "OWNER" }
      },
      subscription: {
        create: {
          provider: "PAYPLUS",
          plan: "FREE",
          status: "TRIALING",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      }
    }
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: workspace.id,
      actorId: userId,
      eventType: "WORKSPACE_CREATED",
      entityType: "workspace",
      entityId: workspace.id
    }
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, email: true, name: true, passwordHash: true }
        });
        if (!user?.passwordHash) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        await bootstrapWorkspace(user.id, user.name);
        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user }) {
      if (!user.id) return false;
      await bootstrapWorkspace(user.id, user.name);
      return true;
    }
  }
});
