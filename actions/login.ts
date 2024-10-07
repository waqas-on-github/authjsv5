"use server";
import { signIn } from "@/auth";
import { GenerateVerficationToken, getUserByEmail } from "@/lib/getuserbyemail";
import { sendVerificationEmail } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signInSchema } from "@/schema/userSchema";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createResponce } from "@/lib/responces";

export const loginAction = async (data: z.infer<typeof signInSchema>) => {
  // Validate input against schema

  const validationResult = signInSchema.safeParse(data);

  // send responce if verification failed
  if (!validationResult.success) {
    return createResponce({ errorMessage: "Invalid fields", success: false });
  }

  const { email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return createResponce({
      success: false,
      errorMessage: "Invalid credentials",
    });
  }

  if (!existingUser.emailVerified) {
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch)
      return createResponce({
        errorMessage: "invalid crediantals ",
        success: false,
      });
    const token = await GenerateVerficationToken(existingUser.email);
    await sendVerificationEmail(email, token);

    return createResponce({
      successMesage: "Verification email sent",
      success: true,
    });
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return createResponce({
      successMesage: "Logged in successfully",
      success: true,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return createResponce({
            errorMessage: "Invalid credentials",
            success: false,
          });
        default:
          return createResponce({
            errorMessage: "Something went wrong",
            success: false,
          });
      }
    }

    // If the error is not an AuthError, return a generic error response
    return createResponce({
      errorMessage: "An unexpected error occurred",
      success: false,
    });
  }
};
