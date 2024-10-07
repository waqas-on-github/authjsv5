"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";

import { signUpSchema } from "@/schema/userSchema";
import { db } from "@/prsmaClient";
import { GenerateVerficationToken } from "@/lib/getuserbyemail";
import { createResponse } from "@/lib/responces";
import { sendVerificationEmail } from "@/lib/mail";

// Helper function for error responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const registerAction = async (data: z.infer<typeof signUpSchema>) => {
  // Validate input against schema
  const validationResult = signUpSchema.safeParse(data);

  if (!validationResult.success) {
    return createResponse({
      success: false,
      errorMessage: "validation failed",
    });
  }

  const { email, name, password } = validationResult.data;

  try {
    // Check if email already exists
    const doesEmailExist = await db.user.findFirst({ where: { email } });

    if (doesEmailExist) {
      return createResponse({
        success: false,
        errorMessage: "email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user data into the database
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    if (user && user.email) {
      const verificationToken: Awaited<
        ReturnType<typeof GenerateVerficationToken>
      > = await GenerateVerficationToken(user.email);

      await sendVerificationEmail(email, verificationToken);
    }

    return createResponse({
      success: true,
      successMesage: "verification email sent ",
    });
  } catch (error) {
    console.error("Error during sign-up:", error); // Log the error for debugging

    return createResponse({
      success: false,
      errorMessage: "Error during sign-up",
    });
  }
};
