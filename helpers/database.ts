import { load } from "https://deno.land/std@0.177.0/dotenv/mod.ts";
const env = await load();
const {
  APP_ID,
  DATA_API_KEY,
} = env;

export const BASE_URI =
  `https://ap-southeast-1.aws.data.mongodb-api.com/app/${APP_ID}/endpoint/data/v1`;

export const POST_OPTIONS = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": DATA_API_KEY,
  },
  body: "",
};
