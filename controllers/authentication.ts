import { load } from "https://deno.land/std@0.177.0/dotenv/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

import { User } from "../models/User.ts";
import { signupValidation } from "../helpers/validations/signup.ts";
// import crypto from "crypto";
// import User from "../models/User.ts";

const env = await load();
const {
  COLLECTION,
  DATABASE,
  DATA_SOURCE,
} = env;

// const postSignin = async (req: any, res: any, next: any) => {
//   const { email, password } = req.body;
//   const validationResults = validationResult(req);

//   if (!validationResults.isEmpty()) {
//     const error: string = validationResults.array()[0].msg;

//     return res.status(422).send({
//       email: email,
//       password: password,
//       error: error,
//     });
//   }

//   // req.session.user = user;
//   // req.session.isAuthenticated = true;
//   // req.session.save(() => res.send({ message: 'Successfully logged in!' }));
//   res.status(200).send({ message: "Successfully logged in!" });
// };

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

// const postUpdatePassword = async (req: any, res: any, next: any) => {
//   const userId = "63f20c3d2f0913bac94b1a59";
//   const { newPassword, confirmPassword, passwordToken } = req.body;
//   const validationResults = validationResult(req);

//   if (!validationResults.isEmpty()) {
//     const error: string = validationResults.array()[0].msg;

//     return res.status(403).send({
//       newPassword: newPassword,
//       confirmPassword: confirmPassword,
//       passwordToken: passwordToken,
//       userId: userId,
//       error: error,
//     });
//   }

//   const user = await User.findOne({
//     // resetToken: passwordToken,
//     // resetTokenExpiration: { $gt: Date.now() },
//     _id: userId,
//   });

//   if (!user) res.status(403).send({ message: "User not found" });

//   if (newPassword == confirmPassword) {
//     const hashedPassword = await bcrypt.hash(newPassword, 12);
//     user.password = hashedPassword;
//     // user.resetToken = undefined;
//     // user.resetTokenExpiration = undefined;
//     user.save();
//     res.status(200).send({ message: "Password has been updated!" });
//   }
// };

export const postSignup = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const data = await body.value;
  const { email, password, confirmPassword } = data;

  const [passes, errors] = await signupValidation(data);

  if (!passes) {
    return response.body = {
      success: false,
      errors: errors,
    };
  }

  const hashedPassword = await bcrypt.hash(password);
  const newUser = new User(email.toLowerCase(), hashedPassword);
  console.log(await newUser.save());
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
