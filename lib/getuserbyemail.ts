import { db } from "@/prsmaClient";

export const getUserByEmail = async (email: string) => {
  return await db.user.findFirst({
    where: {
      email: email,
    },
  });
};
