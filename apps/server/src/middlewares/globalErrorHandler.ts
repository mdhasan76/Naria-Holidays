/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { config } from '../config'
import ApiError from '../errors/ApiError'
import { handleCastValidationError } from '../errors/handleCastValidationError'
import { handleMongooseValidationError } from '../errors/handleMongooseValidationError'
import handleMongoServerError from '../errors/handleMongoServerError'
import { handleZodValidationError } from '../errors/handleZodValidationError'
import { IGenericErrorMessage } from '../interfaces/errorInterface'
import { sendErrorResponse } from '../shared/customResponse'
import { errorLogger } from '../shared/logger'

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  config.env === 'development'
    ? console.log(' 🐱‍🏍 Global Error Handler ~', error)
    : errorLogger.error(' 🐱‍🏍 Global Error Handler ~', error)
  let statusCode = 500
  let message = 'something went wrong'
  let errorMessages: IGenericErrorMessage[] = []

  switch (true) {
    case error?.name === 'ValidationError': {
      const simplifiedError = handleMongooseValidationError(error)
      statusCode = simplifiedError.statusCode
      message = 'Model Validation Error' // simplifiedError.message
      errorMessages = simplifiedError.errorMessages
      break
    }
    case error instanceof ZodError: {
      const simplifiedError = handleZodValidationError(error)
      statusCode = simplifiedError.statusCode
      message = simplifiedError.message
      errorMessages = simplifiedError.errorMessages
      break
    }
    case error.name === 'MongoServerError': {
      const simplifiedError = handleMongoServerError(error)
      statusCode = simplifiedError.statusCode
      message = simplifiedError.message
      errorMessages = simplifiedError.errorMessages
      break
    }
    case error instanceof ApiError: {
      statusCode = error?.statusCode
      message = error?.message
      errorMessages = error?.message
        ? [{ path: '', message: error?.message }]
        : []
      break
    }
    case error?.name === 'CastError': {
      const simplifiedError = handleCastValidationError(error)
      statusCode = simplifiedError?.statusCode
      message = simplifiedError?.message
      errorMessages = simplifiedError?.message
        ? [{ path: '', message: simplifiedError?.message }]
        : []
      break
    }
    case error instanceof Error: {
      message = error?.message
      errorMessages = error?.message
        ? [{ path: '', message: error?.message }]
        : []
      break
    }
  }

  sendErrorResponse(res, {
    status: 'Error',
    statusCode,
    message,
    errorMessages,
  })
}

export default globalErrorHandler
