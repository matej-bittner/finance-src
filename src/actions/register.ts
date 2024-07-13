"use server";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getTranslations } from "next-intl/server";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { useLocale } from "next-intl";
import { languages } from "@/constants";

export const register = async (
  values: z.infer<typeof RegisterSchema>,
  locale: string,
) => {
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

  let language = "en";
  let currency = "eur";
  if (locale) {
    const findLocale = languages.some((language) => language.value === locale);
    if (findLocale) {
      language = locale;
      currency = language === "cs" ? "czk" : "eur";
    }
  }

  await db.user.create({
    data: {
      email,
      password: hashedPw,
      mainLanguage: language,
      mainCurrency: currency,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
    locale,
  );

  return { success: ts("1") };
};
