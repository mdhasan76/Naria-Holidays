import { Response } from 'express'
import httpStatus from 'http-status'
import { IGenericResponse } from '../interfaces/sharedInterface'
import { IGenericErrorResponse } from '../interfaces/errorInterface'

export const sendResponse = <T>(
  res: Response,
  data: IGenericResponse<T>
): void => {
  const response: IGenericResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    meta: data?.meta,
    data: data.data,
    message: data.message || 'Success',
  }
  res.status(httpStatus.OK).json(response)
}

export const sendErrorResponse = (
  res: Response,
  data: IGenericErrorResponse
): void => {
  const response: IGenericErrorResponse = {
    status: data.status,
    statusCode: data.statusCode,
    message: data.message,
    errorMessages: data.errorMessages,
  }
  res.status(response.statusCode).json(response)
}
