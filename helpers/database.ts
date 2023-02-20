import {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";

let database: Database;
const env = await load();
const { DATA_SOURCE, DATABASE_PASSWORD, DB_CLUSTER_URL, DATABASE_NAME } = env;

export async function connect() {
  const client = new MongoClient();
  await client.connect(
    `mongodb+srv://${DATA_SOURCE}:${DATABASE_PASSWORD}@${DB_CLUSTER_URL}/${DATABASE_NAME}?authMechanism=SCRAM-SHA-1`,
  );
  database = client.database("shop");
}

export function getDatabase() {
  return database;
}
