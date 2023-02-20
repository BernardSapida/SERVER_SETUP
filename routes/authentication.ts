import { Router } from 'express'
import AuthController from '../controllers/authentication'
import validate from '../validation/validation_processor'

const router = Router();

router.get('/signin', AuthController.getSignin);

router.post('/signin', validate.signin(), AuthController.postSignin);

router.post('/reset-password', AuthController.postResetPassword);

router.put('/update-password', validate.updatePassword(), AuthController.postUpdatePassword);

router.post('/signup', validate.signup(), AuthController.postSignup);

router.post('/signout', AuthController.postSignout);

export default router;