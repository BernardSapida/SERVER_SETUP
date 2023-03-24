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
import { verify } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";

interface ValidateCredential {
  email: string;
  password: string;
}

export function emailExist(
  email: string,
): Rule {
  return async function uniqueRule(): Promise<Validity> {
    const result = await find("users", { email: email });
    const foundEmail = result.data.documents.length != 0;

    if (!foundEmail) {
      return invalid("validEmail");
    }
  };
}

export function validPassword(
  email: string,
  password: string,
): Rule {
  return async function uniqueRule(): Promise<Validity> {
    const result = await find("users", { email: email });

    if (result.data.documents.length == 0) return invalid("validPassword");

    const hashPassword = result.data.documents[0].password;
    const passwordMatched = verify(password, hashPassword);

    if (!passwordMatched) return invalid("validPassword");
  };
}

export const signinValidation = async (
  data: ValidateCredential,
) => {
  return await validate(data, {
    email: [required, isEmail, emailExist(data.email)],
    password: [
      required,
      minLength(12),
      validPassword(data.email, data.password),
    ],
  }, {
    messages: {
      validEmail: "The email address didn't exist!",
      "password.minLength": "Password is incorrect!",
      validPassword: "Password is incorrect!",
    },
  });
};
