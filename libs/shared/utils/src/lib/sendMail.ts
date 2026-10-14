import { Resend } from "resend";
import { loadEnv } from "@domo/constants";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const env = loadEnv();
const resend = new Resend(env.RESEND_API_KEY);

const getFromEmail = () =>
  env.isDev ? "onboarding@resend.dev" : (env.EMAIL_SENDER ?? "onboarding@resend.dev");

const getToEmail = (to: string) =>
  env.isDev ? "delivered@resend.dev" : to;

export const sendMail = async ({ to, subject, text, html }: Params) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });