import { Resend } from "resend";

import { getTranslations } from "next-intl/server";
import PaymentSuccessfulEmail from "@/components/emails/PaymentSuccessfulEmail";
import VerificationEmail from "@/components/emails/VerificationEmail";
import ResetEmailEmail from "@/components/emails/ResetEmailEmail";
import AccountChangeEmail from "@/components/emails/AccountChangeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  language: string,
) => {
  // const resetLink = `http://localhost:3000/new-password?token=${token}`;
  const link = `http://localhost:3000/${language}/new-password?token=${token}`;
  const t = await getTranslations({
    namespace: "email.password-reset",
    locale: language,
  });
  const messages = {
    subject: t("subject"),
    title: t("title"),
    text1: t("text1"),
    text2: t("text2"),
    text3: t("text3"),
    clickHere: t("clickHere"),
    greeting: t("greeting"),
    greeting2: t("greeting2"),
  };

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: t("subject"),
    react: ResetEmailEmail(link, messages),
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
  language: string,
) => {
  const link = `http://localhost:3000/${language}/new-verification?token=${token}`;
  const t = await getTranslations({
    namespace: "email.verification-register",
    locale: language,
  });
  const messages = {
    subject: t("subject"),
    title: t("title"),
    text1: t("text1"),
    text2: t("text2"),
    clickHere: t("clickHere"),
    text3: t("text3"),
    greeting: t("greeting"),
    greeting2: t("greeting2"),
  };

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: t("subject"),
    react: VerificationEmail(link, messages),
  });
};

export const sendSuccessPayEmail = async (email: string, language: string) => {
  const link = `http://localhost:3000/${language}/dashboard`;
  const t = await getTranslations({
    namespace: "email.subscription-payment",
    locale: language,
  });
  const messages = {
    subject: t("subject"),
    title: t("title"),
    text1: t("text1"),
    text2: t("text2"),
    clickHere: t("clickHere"),
    text3: t("text3"),
    greeting: t("greeting"),
    greeting2: t("greeting2"),
  };

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: t("subject"),
    react: PaymentSuccessfulEmail(link, messages),
  });
};

export const sendChangeOnAccountEmail = async (
  email: string,
  token: string,
  language: string,
) => {
  const link = `http://localhost:3000/${language}/new-verification?token=${token}`;
  const t = await getTranslations({
    namespace: "email.change-on-account",
    locale: language,
  });
  const messages = {
    subject: t("subject"),
    title: t("title"),
    text1: t("text1"),
    text2: t("text2"),
    clickHere: t("clickHere"),
    greeting: t("greeting"),
    greeting2: t("greeting2"),
  };

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: t("subject"),
    react: AccountChangeEmail(link, messages),
  });
};
