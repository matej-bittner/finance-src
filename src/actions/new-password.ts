"use server";
import { z } from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const NewPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null,
) => {
  if (!token) {
    return { error: "Něco se nepovedlo1" };
  }

  const validatedFiled = NewPasswordSchema.safeParse(values);

  if (!validatedFiled.success) {
    return { error: "Něco se nepovedlo2" };
  }

  const { password } = validatedFiled.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Něco se nepovedlo3" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Obnovení nebylo v časovém limitu" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Něco se nepovedlo4" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "Heslo bylo změněno" };
};

export default NewPassword;
