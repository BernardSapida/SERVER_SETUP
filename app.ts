import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import route from "./routes/authentication.ts";

const app = new Application();

// Deno.env.set("APP_PASSWORD", "gcesgedkqhxmdakv");
// Deno.env.set(
//   "DATA_API_KEY",
//   "UTO769Anhub6OIq2NXaOhEr4ce1MuiAtcdPOIkDTmcdwlCm3CWQ7jM34Lj8epHG9",
// );
// Deno.env.set("APP_ID", "data-phvhu");
// Deno.env.set("DATA_SOURCE", "ZShop");
// Deno.env.set("DB_CLUSTER_URL", "zshop.k1sczh5.mongodb.net");
// Deno.env.set("DATABASE", "shop");
// Deno.env.set("DATABASE_PASSWORD", "ZShop123");

app.use(oakCors(
  {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
  },
));

app.use(route.routes());
app.use(route.allowedMethods());
await app.listen({ port: 3000 });
