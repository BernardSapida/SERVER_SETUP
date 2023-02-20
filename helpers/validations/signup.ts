import {
  invalid,
  isEmail,
  minLength,
  required,
  Rule,
  validate,
  Validity,
} from "https://deno.land/x/validasaur/mod.ts";

interface ValidateCredential {
  email: string;
  password: string;
  confirmPassword: string;
}

export function isPasswordMatched(
  password: string,
  confirmPassword: string,
): Rule {
  return async function uniqueRule(value: any): Promise<Validity> {
    if (password !== confirmPassword) {
      return invalid("isPasswordMatched", {
        confirmPassword: "Password and confirm password didn't matched!",
      });
    }
  };
}

export const signupValidation = async (
  data: ValidateCredential,
) => {
  return await validate(data, {
    email: [required, isEmail],
    password: [required, minLength(12)],
    confirmPassword: [
      required,
      isPasswordMatched(data.password, data.confirmPassword),
    ],
  });
};
