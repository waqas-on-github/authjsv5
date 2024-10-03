"use server";

import { db } from "@/prsmaClient";
import { signInSchema } from "@/schema/userSchema";

import * as argon2 from "argon2";
import { z } from "zod";

// Helper function for error responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createErrorResponse = (message: string, issues?: string | any) => ({
  error: {
    message,
    issues,
  },
  data: {},
  success: false,
});

export const loginAction = async (data: z.infer<typeof signInSchema>) => {
  // Validate input against schema
  const validationResult = signInSchema.safeParse(data);

  if (!validationResult.success) {
    return createErrorResponse(
      "Validation failed",
      validationResult.error.issues
    );
  }

  const { email, password } = validationResult.data;

  try {
    // Step 1: Check if the email exists
    const user = await db.user.findFirst({ where: { email } });

    if (!user || !user.password) {
      return createErrorResponse("Email or password is incorrect");
    }

    // Step 2: Verify hashed password
    const passwordMatches = await argon2.verify(user.password, password);

    if (!passwordMatches) {
      return createErrorResponse("Email or password is incorrect");
    }

    // Step 3: Return user data (without password)

    return {
      error: {},
      data: { user: user.email }, // Return sanitized user data
      success: true,
    };
  } catch (error) {
    console.error("Error during sign-in:", error); // Log the error for debugging

    return createErrorResponse(
      "An error occurred during sign-in",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
