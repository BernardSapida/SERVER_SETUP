import { Router } from "https://deno.land/x/oak/mod.ts";
import { load } from "https://deno.land/std@0.177.0/dotenv/mod.ts";
import { postSignup } from "../controllers/authentication.ts";
// import validate from "../validation/validation_processor";

interface Message {
  id: string;
  text: string;
}

const router = new Router();

// router.get("/contact", (context) => {
//   context.response.body = {
//     message: messages,
//   };
// });

// router.post("/contact", async (context) => {
//   const data = await context.request.body();
//   const value = await data.value;

//   const newMessage: Message = {
//     id: new Date().toISOString(),
//     text: value.text,
//   };

//   messages.push(newMessage);

//   context.response.body = { message: "Sent message!", messages: messages };
// });

// router.put("/contact/:id", async (context) => {
//   const id = context.params.id;
//   const data = await context.request.body();
//   const value = await data.value;
//   const messageIdx = messages.findIndex((message) => message.id === id);

//   messages[messageIdx] = { id: messages[messageIdx].id, text: value.text };

//   context.response.body = { message: "Updated message!", messages: messages };
// });

// router.delete("/contact/:id", (context) => {
//   const id = context.params.id;
//   const newMessage = messages.filter((message) => message.id !== id);
//   messages = newMessage;

//   context.response.body = { message: "Deleted message!", messages: messages };
// });

// router.get("/signin", AuthController.getSignin);

// router.post("/signin", validate.signin(), AuthController.postSignin);

// router.post("/reset-password", AuthController.postResetPassword);

// router.put(
//   "/update-password",
//   validate.updatePassword(),
//   AuthController.postUpdatePassword,
// );

router.post("/signup", postSignup);

// router.post("/signout", AuthController.postSignout);

// export default router;

export default router;
