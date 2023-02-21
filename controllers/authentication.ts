import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";

import { User } from "../models/User.ts";

import { signinValidation } from "../helpers/validations/signin.ts";
import { signupValidation } from "../helpers/validations/signup.ts";
import { updatePasswordValidation } from "../helpers/validations/updatePassword.ts";

import { fetchApi } from "../helpers/database.ts";
import { find } from "../helpers/databaseMethods.ts";

// import crypto from "crypto";

const test: Array<number | string> = [];

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
  try {
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
      filter: {
        "_id": { $oid: userId },
      },
      update: {
        "$set": { password: hashedPassword },
      },
    };

    await fetchApi("POST", "updateOne", "users", bodyInformation);

    response.body = {
      success: true,
      message: "Successfully updated password!",
    };
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  }
};

export const postSignup = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
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
    test.push("hashedPassword");
    test.push(hashedPassword);
    const newUser = new User(email.toLowerCase(), hashedPassword);

    await newUser.save();
    response.body = { success: true, message: "Successfully signup!" };
  } catch (error) {
    response.body = {
      test: test,
      success: false,
      message: error.toString(),
    };
  }
};
