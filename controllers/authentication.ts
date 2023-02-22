import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { hash } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
import { load } from "https://deno.land/std@0.177.0/dotenv/mod.ts";

import { User } from "../models/User.ts";
import { signinValidation } from "../helpers/validations/signin.ts";
import { signupValidation } from "../helpers/validations/signup.ts";
import { updatePasswordValidation } from "../helpers/validations/updatePassword.ts";
import { resetPasswordValidation } from "../helpers/validations/resetPassword.ts";

import { MongoAPI } from "../helpers/database.ts";
import { sendMail } from "../helpers/mail/mail.ts";
import { find } from "../helpers/databaseMethods.ts";

const env = await load();
const { WEB_KEY } = env;

export const postSignin = async (context: any) => {
  const { request, response }: { request: any; response: any } = context;

  try {
    const body = await request.body();
    const data = await body.value;
    const encoder = new TextEncoder();
    const jsonWebKey = encoder.encode(WEB_KEY);

    const [passes, errors] = await signinValidation(data);

    if (!passes) {
      return response.body = {
        success: false,
        errors: errors,
      };
    }

    const user = await find("users", { email: data.email });

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      jsonWebKey,
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"],
    );

    const jwtToken = await create(
      { alg: "HS512", typ: "JWT" },
      {
        _id: user.data.documents._id,
        email: user.data.documents.email,
        exp: getNumericDate(60),
      },
      cryptoKey,
    );
    const expiration = 60;

    response.body = {
      success: true,
      authToken: jwtToken,
      expiration: expiration,
      message: "Successfully logged in",
    };
  } catch (error) {
    response.body = {
      success: false,
      error: error.message,
    };
  }
};

export const requestResetPassword = async (
  { request, response }: { request: any; response: any },
) => {
  try {
    const body = await request.body();
    const data = await body.value;
    const { email } = data;
    const token =
      "c2NyeXB0AA4AOxA219746sKQjC3U55XwYyGXRnPN0xZ65k3inzgvtPIwOUMJ8RmhEKKXgDqgzZScmzAkudOwXpFW9";

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
        $set: {
          resetToken: token,
          resetTokenExpiration: Date.now() + 3600000,
        },
      },
    };

    await MongoAPI(
      "POST",
      "updateOne",
      "users",
      bodyInformation,
    );
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

export const resetPassword = async (context: any) => {
  const { response } = context;

  try {
    const token = await context.params.token;
    const tokenValid = await validToken(token);

    if (!tokenValid) {
      throw new Error("The token is invalid!");
    }

    context.response.body = {
      success: true,
      token: token,
    };
  } catch (error) {
    response.body = {
      success: false,
      message: error.message,
    };
  }
};

export const postResetPassword = async (context: any) => {
  const { request, response } = context;

  try {
    const token = await context.params.token;
    const body = await request.body();
    const data = await body.value;
    const { newPassword } = data;
    const tokenValid = await validToken(token);

    if (!tokenValid) {
      throw new Error("The token is invalid!");
    }

    const [passes, errors] = await updatePasswordValidation(data);

    if (!passes) {
      return response.body = {
        status: 403,
        success: false,
        errors: errors,
      };
    }

    const hashedPassword = hash(newPassword);

    const bodyInformation = {
      filter: {
        resetToken: token,
        resetTokenExpiration: { $gte: Date.now() },
      },
      update: {
        $unset: {
          resetToken: "",
          resetTokenExpiration: "",
        },
        $set: { password: hashedPassword },
      },
    };

    await MongoAPI(
      "POST",
      "updateOne",
      "users",
      bodyInformation,
    );

    context.response.body = {
      success: true,
      message: "Password updated successfully!",
    };
  } catch (error) {
    response.body = {
      success: false,
      message: error.message,
    };
  }
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
    const { newPassword } = data;
    const userId = "63f46ddd88d4013bd7b5d5ea";

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
        $set: { password: hashedPassword },
      },
    };

    await MongoAPI("POST", "updateOne", "users", bodyInformation);

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

const validToken = async (token: string) => {
  const result = await find(
    "users",
    {
      resetToken: token,
      resetTokenExpiration: { $gte: Date.now() },
    },
  );

  if (result.data.documents.length == 0) return false;
  return true;
};
