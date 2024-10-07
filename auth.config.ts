import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { signInSchema } from "./schema/userSchema";
import { getUserByEmail } from "./lib/Dal";

export default {
  debug: true,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validateFiels = signInSchema.safeParse(credentials);

        if (validateFiels.success) {
          const { email, password } = validateFiels.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            console.log("user dose not eists ");
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
  secret: process.env.SECRET, // This is required in production
} satisfies NextAuthConfig;
