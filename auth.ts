import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "./prsmaClient";
import { getuserById } from "./lib/getuserbyemail";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async jwt({ token }) {
      if (token && token.sub) {
        const userData = await getuserById(token?.sub);
        if (userData?.role) {
          token.role = userData.role;
        }
      }
      console.log(token);

      return token;
    },
    async session({ session, token }) {
      session.role = token.role as "ADMIN" | "USER";
      return session;
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
