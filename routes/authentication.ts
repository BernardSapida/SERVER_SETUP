import { Router } from "https://deno.land/x/oak/mod.ts";
import { verifyToken } from "../middleware/authentication.ts";
import {
  postResetPassword,
  postSignin,
  postSignup,
  requestResetPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authentication.ts";
import { getMessage } from "../controllers/feed.ts";

const router = new Router();

router.get("/message", verifyToken, getMessage);

router.post("/signin", postSignin);

router.post("/reset-password", requestResetPassword);

router.get("/reset-password/:token", resetPassword);

router.post("/reset-password/:token", postResetPassword);

router.post("/update-password", updatePassword);

router.post("/signup", postSignup);

// router.post("/signout", AuthController.postSignout);

export default router;
