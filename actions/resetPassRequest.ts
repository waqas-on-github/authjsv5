"use server";

import { generateResetToken, getUserByEmail } from "@/lib/Dal";
import { sendResetPasswordEmail } from "@/lib/mail";
import { createResponce } from "@/lib/responces";
import { resetSchema } from "@/schema/userSchema";

export const resetPassRequest = async (email: string) => {
  // validate scchema
  const validateEmail = resetSchema.safeParse({ email });
  if (!validateEmail.success) {
    return createResponce({
      success: false,
      errorMessage: "failed to validate email",
    });
  }

  // get user

  const existingUser = await getUserByEmail(validateEmail.data.email);

  if (!existingUser || !existingUser.email) {
    return createResponce({
      success: false,
      errorMessage: "Email not found!",
    });
  }

  // if user found generate the reset token send email to user

  const resetPasswordToken = await generateResetToken(existingUser.email);

  const sendTokenResponce = await sendResetPasswordEmail(
    existingUser.email,
    resetPasswordToken
  );

  console.log(sendTokenResponce);

  if (sendTokenResponce.error) {
    return createResponce({
      success: false,
      errorMessage: "failed to send email try again",
    });
  }

  return createResponce({
    success: true,
    successMesage: "email has been sent check you email",
    responce: sendTokenResponce,
  });
};
