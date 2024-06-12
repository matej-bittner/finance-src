"use server";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getTranslations } from "next-intl/server";
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: te("1") };
  }
  const { email, password } = validatedFields.data;

  const hashedPw = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: te("5") };
  }

  await db.user.create({
    data: {
      email,
      password: hashedPw,
    },
  });

  return { success: ts("1") };
};
