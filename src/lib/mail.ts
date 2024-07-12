import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Obnovení Hesla",
    html: `<p>Klikni <a href=${resetLink}>Zde</a></p>`,
  });
};
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your Email",
    html: `<p>Click <a href="${confirmLink}">here</a></p>`,
  });
};

export const sendWelcomeEmail = async (email: string) => {
  const dashboardLink = `http://localhost:3000/cs/dashboard`;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your Email",
    html: `<p>Click <a href="${dashboardLink}">here</a></p>`,
  });
};
