"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";

import { signUpSchema } from "@/schema/userSchema";
import { db } from "@/prsmaClient";
import { sendVerificationEmail } from "@/lib/mail";
import { createResponce } from "../lib/responces";
import { generateVerficationToken } from "@/lib/Dal";

export const registerAction = async (data: z.infer<typeof signUpSchema>) => {
  // Validate input against schema
  const validationResult = signUpSchema.safeParse(data);

  if (!validationResult.success) {
    return createResponce({
      success: false,
      errorMessage: "validation failed",
    });
  }

  const { email, name, password } = validationResult.data;

  try {
    // Check if email already exists
    const doesEmailExist = await db.user.findFirst({ where: { email } });

    if (doesEmailExist) {
      return createResponce({
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
        ReturnType<typeof generateVerficationToken>
      > = await generateVerficationToken(user.email);

      await sendVerificationEmail(email, verificationToken.token);
    }

    return createResponce({
      success: true,
      successMesage: "verification email sent ",
    });
  } catch (error) {
    console.error("Error during sign-up:", error); // Log the error for debugging

    return createResponce({
      success: false,
      errorMessage: "Error during sign-up",
    });
  }
};
