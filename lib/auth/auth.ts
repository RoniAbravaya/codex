import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
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
      const existing = await prisma.membership.findFirst({ where: { userId: user.id } });
      if (!existing) {
        const workspace = await prisma.workspace.create({
          data: {
            name: `${user.name ?? "My"} Workspace`,
            ownerId: user.id,
            memberships: {
              create: { userId: user.id, role: "OWNER" }
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
            actorId: user.id,
            eventType: "WORKSPACE_CREATED",
            entityType: "workspace",
            entityId: workspace.id
          }
        });
      }
      return true;
    }
  }
});
