import { find } from "../../helpers/databaseMethods.ts";
import {
  invalid,
  isEmail,
  required,
  Rule,
  validate,
  Validity,
} from "https://deno.land/x/validasaur/mod.ts";

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

export const resetPasswordValidation = async (
  data: ValidateCredential,
) => {
  return await validate(data, {
    email: [required, isEmail, emailExist(data.email)],
  }, {
    messages: {
      error_email: "The email address didn't exist!",
    },
  });
};
