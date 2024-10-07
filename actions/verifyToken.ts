"use server";
import { getUserByEmail } from "@/lib/Dal";
import { createResponce } from "@/lib/responces";
import { db } from "@/prsmaClient";
import { Role as PrismaRole } from "@prisma/client"; // Adjust the import path as necessary

export interface User {
  id: string; // Unique identifier for the user
  name?: string | null; // User's name (optional)
  email?: string | null; // User's email (optional, must be unique)
  password?: string | null; // User's password (optional)
  emailVerified?: Date | null; // Date when the email was verified (optional)
  image?: string | null; // URL of the user's image (optional)
  role: PrismaRole; // Use Prisma's Role enum
}

export const verifyToken = async (token: string) => {
  //check token
  const allTokens = await db.verficationToken.findMany({});
  console.log(allTokens);

  const existingToken = await db.verficationToken.findFirst({
    where: { token: token },
  });

  if (!existingToken) {
    return createResponce({
      success: false,
      errorMessage: "Token dose not found! ",
    });
  }

  //check epiry date/time

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return createResponce({
      success: false,
      errorMessage: "Token has Expired! ",
    });
  }

  //get user from db
  const existinguser = await getUserByEmail(existingToken.email);

  if (!existinguser) {
    return createResponce({
      success: false,
      errorMessage: "Email dose not exist! ",
    });
  }

  // update user verification in db
  const verifiedUser = await db.user.update({
    where: { id: existinguser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // delete verification token from db

  // await db.verficationToken.delete({ where: { id: existingToken.id } });

  return createResponce<User>({
    success: true,
    successMesage: "email verified",
    responce: verifiedUser,
  });
};
