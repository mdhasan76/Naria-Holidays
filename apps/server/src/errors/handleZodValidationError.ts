import { ZodError, ZodIssue } from 'zod'
import {
  IGenericErrorMessage,
  IGenericErrorResponse,
} from '../interfaces/errorInterface'

export const handleZodValidationError = (
  error: ZodError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      message: 'Zod ' + issue.message,
      path: issue.path[issue.path.length - 1] as string,
    }
  })

  const statusCode = 400
  return {
    status: 'false',
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  }
}
