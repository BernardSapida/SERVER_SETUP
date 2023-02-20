// import { body } from 'express-validator'

// const validatePassword = () => {
//     return [
//         validateNewPassword(),
//         validateConfirmPassword()
//     ];
// }

// const validateNewPassword = () => {
//     return [
//         body('newPassword', 'The password length must be at least 12 characters long')
//         .isLength({ min: 12 })
//         .trim()
//     ]
// }

// const validateConfirmPassword = () => {
//     return [
//         body('confirmPassword')
//         .trim()
//         .custom((confirmPassword, { req }) => {
//             if(req.body.newPassword !== confirmPassword) {
//                 throw new Error('The password and confirm password didn\'t matched.');
//             }
//             return true;
//         })
//     ]
// }

// export default validatePassword;
