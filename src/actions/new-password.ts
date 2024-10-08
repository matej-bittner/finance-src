"use server";
import { z } from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";

const NewPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null,
) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  if (!token) {
    return { error: te("4") };
  }

  const validatedFiled = NewPasswordSchema.safeParse(values);

  if (!validatedFiled.success) {
    return { error: te("4") };
  }

  const { password } = validatedFiled.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: te("4") };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: te("17") };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: te("4") };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: ts("13") };
};

export default NewPassword;
