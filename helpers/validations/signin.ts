import { find } from "../../helpers/databaseMethods.ts";
import {
  invalid,
  isEmail,
  minLength,
  required,
  Rule,
  validate,
  Validity,
} from "https://deno.land/x/validasaur/mod.ts";
import { verify } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

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
      return invalid("error_email");
    }
  };
}

export function validPassword(
  email: string,
  password: string,
): Rule {
  return async function uniqueRule(): Promise<Validity> {
    const result = await find("users", { email: email });

    if (result.data.documents.length == 0) return invalid("error_password");

    const hashPassword = result.data.documents[0].password;
    // const passwordMatched = await bcrypt.compare(password, hashPassword);
    const passwordMatched = verify(password, hashPassword);

    if (!passwordMatched) return invalid("error_password");
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
      error_email: "The email address didn't exist!",
      error_password: "Password is incorrect!",
    },
  });
};
