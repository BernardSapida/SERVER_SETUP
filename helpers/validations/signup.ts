import { find } from "../../helpers/databaseMethods.ts";
import {
  invalid,
  isEmail,
  minLength,
  required,
  Rule,
  validate,
  Validity,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

interface ValidateCredential {
  email: string;
  password: string;
  confirmPassword: string;
}

export function isPasswordMatched(
  password: string,
  confirmPassword: string,
): Rule {
  return function uniqueRule() {
    if (password !== confirmPassword) {
      return invalid("error_password");
    }
  };
}

export function notEmailExist(
  email: string,
): Rule {
  return async function uniqueRule(): Promise<Validity> {
    const findEmail = await find("users", { email: email });

    if (findEmail.data.documents.length > 0) {
      return invalid("error_email");
    }
  };
}

export const signupValidation = async (
  data: ValidateCredential,
) => {
  return await validate(data, {
    email: [required, isEmail, notEmailExist(data.email)],
    password: [required, minLength(12)],
    confirmPassword: [
      required,
      isPasswordMatched(data.password, data.confirmPassword),
    ],
  }, {
    messages: {
      "password.minLength": "Password must be at least 12 characters long.",
      error_email: "The email address has already been registered!",
      error_password: "Password and confirm password didn't matched!",
    },
  });
};
