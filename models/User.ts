import { fetchApi } from "../helpers/database.ts";
import { response } from "../helpers/databaseMethods.ts";
import { sendMail } from "../helpers/mail/mail.ts";

export class User {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  async save() {
    try {
      const document = {
        document: {
          email: this.email,
          password: this.password,
        },
      };

      const result = await fetchApi("POST", "insertOne", "users", document);

      if (result.status === 403) {
        return response(false, result.data);
      }

      const insertedId = await result.data;

      // sendMail(
      //   this.email,
      //   "Account Signup",
      //   "Account successfully signed up",
      //   "<h1>Account successfully signed up!</h1>",
      // );

      return response(true, insertedId);
    } catch (error) {
      return response(true, error);
    }
  }
}
