import { load } from "https://deno.land/std@0.177.0/dotenv/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

import { User } from "../models/User.ts";
import { signinValidation } from "../helpers/validations/signin.ts";
import { signupValidation } from "../helpers/validations/signup.ts";
import { updatePasswordValidation } from "../helpers/validations/updatePassword.ts";
import { find } from "../helpers/databaseMethods.ts";
import { fetchApi } from "../helpers/database.ts";

// import crypto from "crypto";
// import User from "../models/User.ts";

const env = await load();
const {
  COLLECTION,
  DATABASE,
  DATA_SOURCE,
} = env;

export const postSignin = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const data = await body.value;

  const [passes, errors] = await signinValidation(data);

  if (!passes) {
    return response.body = {
      success: false,
      errors: errors,
    };
  }

  response.body = { success: true, message: "Successfully logged in!" };
};

// const postResetPassword = (req: any, res: any, next: any) => {
//   const { email } = req.body;

//   crypto.randomBytes(32, async (error, buffer) => {
//     if (error) {
//       console.error(error);
//       return res.redirect("/reset-password");
//     }

//     const token = buffer.toString("hex");
//     const user = await User.findOne({ email: email });

//     if (!user) {
//       req.flash("error", "Email didn't exist!");
//       return res.redirect("/reset-password");
//     }

//     user.resetToken = token;
//     user.resetTokenExpiration = Date.now() + 3600000;
//     await user.save();
//     res.redirect("/");

//     // sendMail(
//     //     email,
//     //     'Reset Password',
//     //     'Reset Password',
//     //     `
//     //         <p>You requested a password reset.</p>
//     //         <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
//     //     `
//     // );
//   });
// };

export const updatePassword = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const data = await body.value;
  const { newPassword, passwordToken } = data;
  const userId = "63f442b288d4013bd7aa6445";

  const [passes, errors] = await updatePasswordValidation(data);

  if (!passes) {
    return response.body = {
      success: false,
      errors: errors,
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword);

  const bodyInformation = {
    filter: { "_id": userId },
    update: {
      "$set": { password: hashedPassword },
    },
  };

  const result = await fetchApi("POST", "updateOne", "users", bodyInformation);

  console.log(await result);

  response.body = { success: true, message: "Successfully updated password!" };
};

export const postSignup = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const data = await body.value;
  const { email, password } = data;

  const [passes, errors] = await signupValidation(data);

  if (!passes) {
    return response.body = {
      success: false,
      errors: errors,
    };
  }

  const hashedPassword = await bcrypt.hash(password);
  const newUser = new User(email.toLowerCase(), hashedPassword);

  await newUser.save();

  response.body = { success: true, message: "Successfully signup!" };
};

// const postSignout = async (req: any, res: any, next: any) => {
//   res.send({ message: "You are signed out" });
// };

// const sendMail = (
//   email: string,
//   subject = "Subject",
//   text = "Hello World!",
//   html: string,
// ) => {
//   const mailTransporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     requireTLS: true,
//     secure: true,
//     service: "gmail",
//     auth: {
//       user: "burgerhub.service@gmail.com",
//       pass: process.env.APP_PASSWORD,
//     },
//   });

//   const data = {
//     to: email,
//     from: "burgerhub.service@gmail.com",
//     subject: subject,
//     text: text,
//     html: html,
//   };

//   // mailTransporter.sendMail(data);
// };
