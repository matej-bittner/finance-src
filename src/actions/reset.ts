"use server";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import * as z from "zod";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFiled = ResetSchema.safeParse(values);
  if (!validatedFiled.success) {
    return { error: "neplatný email" };
  }

  const { email } = validatedFiled.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Zkontolujte vyplněná data a zkuste to znovu" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: "Email pro resetování byl odeslán" };
};
