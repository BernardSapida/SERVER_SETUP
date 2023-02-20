import { load } from "https://deno.land/std@0.177.0/dotenv/mod.ts";
import { BASE_URI, POST_OPTIONS } from "../helpers/database.ts";

interface RequestBody {
  dataSource: string;
  database: string;
  collection: string;
  document?: Record<string, unknown>;
}

const env = await load();
const {
  COLLECTION,
  DATABASE,
  DATA_SOURCE,
} = env;

const requestBody: RequestBody = {
  dataSource: DATA_SOURCE,
  database: DATABASE,
  collection: "users",
};

export class User {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  async save() {
    try {
      const URI = `${BASE_URI}/action/insertOne`;

      POST_OPTIONS.body = JSON.stringify({
        ...requestBody,
        document: {
          email: this.email,
          password: this.password,
        },
      });

      const dataResponse = await fetch(URI, POST_OPTIONS);
      const insertedId = await dataResponse.json();

      return {
        status: 201,
        body: {
          success: true,
          data: {
            insertedId: insertedId,
            email: this.email,
            password: this.password,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        msg: error.toString(),
      };
    }
  }
}
