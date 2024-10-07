import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  const result = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "waqasvu892@gmail.com",
    subject: "Account Confirmation ",
    html: `<p> <a href="${confirmLink}" >click here  </a> to confirm your email  </p>`,
  });

  return result;
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-password?token=${token}`;
  const result = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "waqasvu892@gmail.com",
    subject: "Reset Password",
    html: `<p><a href="${confirmLink}" >click here  </a> to reset your password  </p>`,
  });

  return result;
};
