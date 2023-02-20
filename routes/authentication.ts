import { Router } from "https://deno.land/x/oak/mod.ts";
import { BASE_URI, options } from "../helpers/database.ts";
import { load } from "https://deno.land/std@0.177.0/dotenv/mod.ts";
// import AuthController from "../controllers/authentication";
// import validate from "../validation/validation_processor";

interface Message {
  id: string;
  text: string;
}

const router = new Router();
let messages: Array<Message> = [];
const env = await load();
const {
  COLLECTION,
  DATABASE,
  DATA_SOURCE,
} = env;

router.post("/", async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const body = await request.body();
      const message = await body.value;

      const URI = `${BASE_URI}/action/insertOne`;
      const query = {
        dataSource: DATA_SOURCE,
        database: DATABASE,
        collection: COLLECTION,
        document: message,
      };

      options.body = JSON.stringify(query);
      const dataResponse = await fetch(URI, options);
      const insertedId = await dataResponse.json();
      console.log(insertedId);

      response.status = 201;
      response.body = {
        success: true,
        data: message,
        insertedId: insertedId,
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
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

// router.get("/signin", AuthController.getSignin);

// router.post("/signin", validate.signin(), AuthController.postSignin);

// router.post("/reset-password", AuthController.postResetPassword);

// router.put(
//   "/update-password",
//   validate.updatePassword(),
//   AuthController.postUpdatePassword,
// );

// router.post("/signup", validate.signup(), AuthController.postSignup);

// router.post("/signout", AuthController.postSignout);

// export default router;

export default router;
