"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";

import { signUpSchema } from "@/schema/userSchema";
import { db } from "@/prsmaClient";

// Helper function for error responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createErrorResponse = (message: string, issues: any = null) => ({
  error: {
    message,
    issues,
  },
  data: {},
  success: false,
});

export const registerAction = async (data: z.infer<typeof signUpSchema>) => {
  // Validate input against schema
  const validationResult = signUpSchema.safeParse(data);

  if (!validationResult.success) {
    return createErrorResponse(
      "Validation failed",
      validationResult.error.issues
    );
  }

  const { email, name, password } = validationResult.data;

  try {
    // Check if email already exists
    const doesEmailExist = await db.user.findFirst({ where: { email } });

    if (doesEmailExist) {
      return createErrorResponse("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user data into the database
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      error: {},
      data: { user: { id: user.id, email: user.email, name: user.name } }, // Return only necessary user data
      success: true,
    };
  } catch (error) {
    console.error("Error during sign-up:", error); // Log the error for debugging

    return createErrorResponse(
      "An error occurred during sign-up",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
