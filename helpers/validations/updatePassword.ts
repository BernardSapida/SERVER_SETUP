import { find } from "../../helpers/databaseMethods.ts";
import {
  invalid,
  minLength,
  required,
  Rule,
  validate,
} from "https://deno.land/x/validasaur/mod.ts";

interface ValidateCredential {
  newPassword: string;
  confirmPassword: string;
}

export function isPasswordMatched(
  password: string,
  confirmPassword: string,
): Rule {
  return function uniqueRule() {
    if (password !== confirmPassword) {
      return invalid("error_confirm_password");
    }
  };
}

export const updatePasswordValidation = async (
  data: ValidateCredential,
) => {
  return await validate(data, {
    newPassword: [required, minLength(12)],
    confirmPassword: [
      required,
      isPasswordMatched(data.newPassword, data.confirmPassword),
    ],
  }, {
    messages: {
      error_confirm_password:
        "New password and confirm password didn't matched!",
    },
  });
};
