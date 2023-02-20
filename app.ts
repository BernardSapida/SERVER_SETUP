import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { connect } from "./helpers/database.ts";

const app = new Application();
const router = new Router();

interface Message {
  id: string;
  text: string;
}

let messages: Array<Message> = [];

router.get("/", (context) => {
  context.response.body = `<!DOCTYPE html>
        <html>
        <head><title>Hello world!</title><head>
        <body>
            <h1>Hello world!</h1>
        </body>
        </html>
    `;
});

router.get("/contact", (context) => {
  context.response.body = {
    message: messages,
  };
});

router.post("/contact", async (context) => {
  const data = await context.request.body();
  const value = await data.value;

  const newMessage: Message = {
    id: new Date().toISOString(),
    text: value.text,
  };

  messages.push(newMessage);

  context.response.body = { message: "Sent message!", messages: messages };
});

router.put("/contact/:id", async (context) => {
  const id = context.params.id;
  const data = await context.request.body();
  const value = await data.value;
  const messageIdx = messages.findIndex((message) => message.id === id);

  messages[messageIdx] = { id: messages[messageIdx].id, text: value.text };

  context.response.body = { message: "Updated message!", messages: messages };
});

router.delete("/contact/:id", (context) => {
  const id = context.params.id;
  const newMessage = messages.filter((message) => message.id !== id);
  messages = newMessage;

  context.response.body = { message: "Deleted message!", messages: messages };
});

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

app.use(router.routes());
app.use(router.allowedMethods());

connect().then(() => app.listen({ port: 3000 }));
