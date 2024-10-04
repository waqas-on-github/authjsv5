"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signInSchema } from "@/schema/userSchema";

import { AuthError } from "next-auth";
import { z } from "zod";

// Helper function for error responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const createErrorResponse = (message: string, issues?: string | any) => ({
//   error: {
//     message,
//     issues,
//   },
//   data: {},
//   success: false,
// });

export const loginAction = async (data: z.infer<typeof signInSchema>) => {
  // Validate input against schema
  const validationResult = signInSchema.safeParse(data);

  if (!validationResult.success) {
    return { error: "invalid fields" };
  }

  const { email, password } = validationResult.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "invalid crediantals" };
        default:
          return { error: "some thing went wrong" };
      }
    }
    throw error;
  }
};

