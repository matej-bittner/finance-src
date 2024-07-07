"use server";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import * as z from "zod";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { getTranslations } from "next-intl/server";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  const validatedFiled = ResetSchema.safeParse(values);
  if (!validatedFiled.success) {
    return { error: te("18") };
  }

  const { email } = validatedFiled.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: te("19") };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: ts("15") };
};
