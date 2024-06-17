"use server";

import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { getUserByEmail } from "@/data/user";

const NewVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Obnovení se nezdařilo, zkuste to znovu" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Akce nebyla dokončena v časovém limitu, zkuste to znovu" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Obnovení se nezdařilo, zkuste to znovu" };
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

  return { success: "Email byl ověřen!" };
};

export default NewVerification;
