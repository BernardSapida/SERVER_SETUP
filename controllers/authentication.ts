import { hash } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
import { User } from "../models/User.ts";

import { signinValidation } from "../helpers/validations/signin.ts";
import { signupValidation } from "../helpers/validations/signup.ts";
import { updatePasswordValidation } from "../helpers/validations/updatePassword.ts";
import { resetPasswordValidation } from "../helpers/validations/resetPassword.ts";

import { fetchApi } from "../helpers/database.ts";
import { sendMail } from "../helpers/mail/mail.ts";

// import crypto from "crypto";

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

export const postResetPassword = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    const body = await request.body();
    const data = await body.value;
    const { email } = data;
    const token =
      "c2NyeXB0AA4AAAAIAAAAAQjC3U55XwYyGXRnPN0xZ65k3inzgvtPIwOUMJ8RmhEKKXg+DqgzZScmzAkudOwXpFW9/DhGfGoJmK/wGG3c/ROR9PZ1hYivLdNwZyRf1qIj";

    const [passes, errors] = await resetPasswordValidation(data);

    if (!passes) {
      return response.body = {
        success: false,
        errors: errors,
      };
    }

    const bodyInformation = {
      filter: { email: email },
      update: {
        "$set": {
          resetToken: token,
          resetTokenExpiration: Date.now() + 3600000,
        },
      },
    };

    await fetchApi("POST", "updateOne", "users", bodyInformation);

    response.body = {
      success: true,
      message: "Successfully sent a reset password link in your email!",
    };

    // send email
    sendMail(
      email,
      "Account Reset Password Link",
      "Reset Password",
      `
      <h1>Reset Password</h1>
      <p>Click <a href="http://localhost:3000/reset-password/${token}">here</a> to reset your password.</p>
      `,
    );
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  }
};

export const resetPassword = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  console.log("HERE:");
  const token = await request.params.token;
  response.body = {
    success: true,
    message: token,
  };
};

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

    const hashedPassword = hash(newPassword);

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

    const hashedPassword = hash(password);
    const newUser = new User(email.toLowerCase(), hashedPassword);

    await newUser.save();
    response.body = { success: true, message: "Successfully signup!" };
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  }
};
