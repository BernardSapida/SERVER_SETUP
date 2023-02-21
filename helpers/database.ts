import { load } from "https://deno.land/std@0.177.0/dotenv/mod.ts";
const env = await load();
const {
  APP_ID,
  DATA_API_KEY,
  DATABASE,
  DATA_SOURCE,
} = env;

export const fetchApi = async (
  method: string,
  action: string,
  collection: string,
  options: Record<string, unknown>,
) => {
  try {
    const BASE_URI = `https://ap-southeast-1.aws.data.mongodb-api.com/app/${
      Deno.env.get("APP_ID")
    }/endpoint/data/v1`;
    const URI = `${BASE_URI}/action/${action}`;
    const POST_OPTIONS = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "api-key": Deno.env.get("DATA_API_KEY")!,
      },
      body: JSON.stringify({
        dataSource: Deno.env.get("DATA_SOURCE"),
        database: Deno.env.get("DATABASE"),
        collection: collection,
        ...options,
      }),
    };

    const response = await fetch(URI, POST_OPTIONS);
    const insertedId = await response.json();

    return {
      status: 200,
      data: insertedId,
    };
  } catch (error) {
    return {
      status: 403,
      data: error,
    };
  }
};
