import { IPaginationOption } from '../interfaces/sharedInterface'

interface IOptionWithSkip extends IPaginationOption {
  skip: number
}

const paginationHelper = (option: IPaginationOption): IOptionWithSkip => {
  const page = Number(option.page) || 1
  const limit = Number(option.limit) || 30
  const skip = (page - 1) * limit

  const sortBy = option.sortBy || 'createdAt'
  const sortOrder = option.sortOrder || 'desc'

  return { page, limit, skip, sortBy, sortOrder }
}

export default paginationHelper
