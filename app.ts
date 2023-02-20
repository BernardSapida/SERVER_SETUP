import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import route from "./routes/authentication.ts";

const app = new Application();

app.use(oakCors(
  {
    "origin": [
      "https://dcit24-midterm-reviewer.vercel.app/",
      "http://localhost:5173",
    ],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
  },
));

app.use(route.routes());
app.use(route.allowedMethods());
await app.listen({ port: 3000 });
