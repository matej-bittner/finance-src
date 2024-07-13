"use server";

import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { getUserByEmail } from "@/data/user";
import { getTranslations } from "next-intl/server";

const NewVerification = async (token: string) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: te("4") };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: te("17") };
  }

  let existingUser;

  if (existingToken.oldEmail) {
    existingUser = await getUserByEmail(existingToken.oldEmail);
  } else {
    existingUser = await getUserByEmail(existingToken.email);
  }

  if (!existingUser) {
    return { error: te("4") };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      // will be used form changing email in future
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({ where: { id: existingToken.id } });

  return { success: ts("14") };
};

export default NewVerification;
