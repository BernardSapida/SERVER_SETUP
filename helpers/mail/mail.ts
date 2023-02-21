import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { load } from "https://deno.land/std@0.177.0/dotenv/mod.ts";
const env = await load();
const { APP_PASSWORD } = env;

const client = new SmtpClient();

export const sendMail = async (
  email: string,
  subject: string,
  content: string,
  html: string,
) => {
  await client.connectTLS({
    hostname: "smtp.gmail.com",
    port: 587,
    username: "burgerhub.service@gmail.com",
    password: APP_PASSWORD,
  });

  await client.send({
    from: "burgerhub.service@gmail.com",
    to: email,
    subject: subject, // Mail Title
    content: content,
    html: html,
  });

  await client.close();
};
