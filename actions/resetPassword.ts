"use server";
import bcrypt from "bcryptjs";
import { NewPasswordSchema } from "@/schema/userSchema";
import { getResetPasswordTokenByToken, getUserByEmail } from "@/lib/Dal";
import { db } from "@/prsmaClient";
import { createResponce } from "@/lib/responces";

export const resetPassword = async ({
  password,
  token,
}: {
  password: string;
  token: string;
}) => {
  if (!token) {
    return createResponce({ success: false, errorMessage: "missing token" });
  }

  const validatedFields = NewPasswordSchema.safeParse({ password: password });

  if (!validatedFields.success) {
    return createResponce({
      success: false,
      errorMessage: "Invalid fields!",
    });
  }

  const existingToken = await getResetPasswordTokenByToken(token);

  if (!existingToken) {
    return createResponce({
      success: false,
      errorMessage: "Invalid token!",
    });
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return createResponce({
      success: false,
      errorMessage: "Token has expired!",
    });
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return createResponce({
      success: false,
      errorMessage: "Email does not exist!",
    });
  }

  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  return createResponce({
    success: true,
    successMesage: "password updated successfully",
  });
};
