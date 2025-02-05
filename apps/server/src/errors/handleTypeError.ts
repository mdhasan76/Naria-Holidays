// import mongoose from 'mongoose'
// import {
//   IGenericErrorMessage,
//   IGenericErrorResponse,
// } from '../interfaces/errorInterface'

// export const handleMongooseValidationError = (
//   error: mongoose.Error.TypeError
// ): IGenericErrorResponse => {
//   const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
//     (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
//       return {
//         message: el.message,
//         path: el.path,
//       }
//     }
//   )

//   const statusCode = 400
//   return {
//     status: 'false',
//     statusCode,
//     message: 'Validation Error',
//     errorMessages: errors,
//   }
// }
