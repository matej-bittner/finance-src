"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getTranslations } from "next-intl/server";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { cookies } from "next/headers";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: te("1") };
  }
  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: te("2") };
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    return { error: te("3") };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
      existingUser.mainLanguage,
    );
    return { success: ts("1") };
  }

  let redirectUrl = DEFAULT_LOGIN_REDIRECT;
  if (!existingUser.hasAccess) {
    redirectUrl = "/subscription-select";
  }

  const supportedLanguages = ["en", "cs"]; // Replace with your supported languages
  if (
    existingUser?.mainLanguage &&
    supportedLanguages.includes(existingUser.mainLanguage)
  ) {
    cookies().set("preferredLanguage", existingUser.mainLanguage);

    if (!existingUser.hasAccess) {
      redirectUrl = `/${existingUser.mainLanguage}/subscription-select`; // Construct URL with locale prefix
    } else {
      redirectUrl = `/${existingUser.mainLanguage}${DEFAULT_LOGIN_REDIRECT}`; // Construct URL with locale prefix
    }
  }

  // if (
  //   existingUser?.mainLanguage &&
  //   supportedLanguages.includes(existingUser.mainLanguage)
  // ) {
  //   redirectUrl = `/${existingUser.mainLanguage}${DEFAULT_LOGIN_REDIRECT}`; // Construct URL with locale prefix
  // }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: te("3") };
        default:
          return { error: te("4") };
      }
    }
    throw error;
  }

  return { success: ts("1") };
};
