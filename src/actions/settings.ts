"use server";
import { z } from "zod";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { currentUser } from "@/helpers/current-user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendChangeOnAccountEmail, sendVerificationEmail } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  const user = await currentUser();

  if (!user?.id) return { error: te("4") };

  const dbUser = await getUserById(user.id);
  if (!dbUser) return { error: te("4") };

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: te("5") };
    }

    const verificationToken = await generateVerificationToken(
      values.email,
      dbUser.email,
    );
    await sendChangeOnAccountEmail(
      verificationToken.email,
      verificationToken.token,
      dbUser.mainLanguage,
    );
    return { success: ts("1") };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordMatch) {
      return { error: te("20") };
    }

    const hashedPw = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPw;
    values.newPassword = undefined;

    // return { success: ts("13") };
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: ts("18") };
};
