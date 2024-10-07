import "server-only";
import { db } from "@/prsmaClient";
import { v4 as uuidv4 } from "uuid";

export const getUserByEmail = async (email: string) => {
  return await db.user.findFirst({
    where: {
      email: email,
    },
  });
};

export const getuserById = async (userId: string) => {
  return await db.user.findFirst({
    where: {
      id: userId,
    },
  });
};

export const getVerificationTokenByEmail = async (email: string) => {
  return await db.verficationToken.findFirst({
    where: { email: email },
  });
};

export const getVerificationTokenByToken = async (token: string) => {
  return await db.verficationToken.findUnique({
    where: { token: token },
  });
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  return await db.passwordResetToken?.findFirst({ where: { email } });
};

export const getResetPasswordTokenByToken = async (token: string) => {
  return await db.passwordResetToken?.findUnique({ where: { token } });
};

export const generateVerficationToken = async (email: string) => {
  const token = uuidv4();

  // sets one hour epiry time
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verficationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verficationToken.create({
    data: { email: email, expires: expires, token: token },
  });
  // console.log("verification generated and added to db ");

  // console.log(verificationToken);

  return verificationToken;
};

export const generateResetToken = async (email: string) => {
  const token = uuidv4();

  // sets one hour epiry time
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getResetPasswordTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.passwordResetToken.create({
    data: { email: email, expires: expires, token: token },
  });
  return verificationToken.token;
};
