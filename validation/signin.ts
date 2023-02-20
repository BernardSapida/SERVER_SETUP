// import { body } from 'express-validator'
// import bcrypt from 'bcryptjs'
// import User from '../models/User'

// const validateSignin = () => {
//     return [
//         validateEmail(),
//         validatePassword()
//     ];
// }

// const validateEmail = () => {
//     return [
//         body('email')
//         .isEmail()
//         .withMessage('Please enter a valid email!')
//         .trim()
//         .custom(async (email, { req }) => {
//             const { password } = req.body;
//             const user = await User.findOne({ email: email });

//             if(!user) {
//                 throw new Error('The email address didn\'t exist!');
//             }

//             const matchedPassword = await bcrypt.compare(password, user.password);

//             if(!matchedPassword) {
//                 throw new Error('The password is incorrect!');
//             }

//             return true;
//         })
//     ]
// }

// const validatePassword = () => {
//     return [
//         body('password', 'The password length must be at least 12 characters long')
//         .isLength({ min: 12 })
//         .trim()
//     ]
// }

// export default validateSignin;
