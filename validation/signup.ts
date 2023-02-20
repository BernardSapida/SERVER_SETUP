// import { body } from 'express-validator'
// import User from '../models/User'

// const validateSignup = () => {
//     // .custom(value => {
//     //     if(value.split('@')[1] === "cvsu.edu.ph") {
//     //         throw new Error('This email is forbidden');
//     //     }
//     // })

//     return [
//         validateEmail(),
//         validatePassword(),
//         validateConfirmPassword()
//     ];
// }

// const validateEmail = () => {
//     return [
//         body('email', 'Please enter a valid email!')
//         .isEmail()
//         .trim()
//         .custom(async email => {
//             const user = await User.findOne({ email: email });

//             if(user) throw new Error('Email already exists!');
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

// const validateConfirmPassword = () => {
//     return [
//         body('confirmPassword')
//         .trim()
//         .custom((confirmPassword, { req }) => {
//             if(req.body.password !== confirmPassword) {
//                 throw new Error('The password and confirm password didn\'t matched.');
//             }
//             return true;
//         })
//     ]
// }

// export default validateSignup;
