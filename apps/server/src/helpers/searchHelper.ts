import paginationHelper from './paginationHelper'
import { SortOrder } from 'mongoose'
import {
  IDateRangeFilters,
  IPaginationOption,
} from '../interfaces/sharedInterface'

interface ISearchableFields {
  searchTerm?: string
}

export const searchHelper = <IFilters extends ISearchableFields>(
  filters: IFilters,
  pagination: IPaginationOption,
  searcheableFields: string[],
  customCondition?: any,
  dateRange?: IDateRangeFilters,
  isDeleted?: boolean
) => {
  const { searchTerm, ...filtersData } = filters
  const andCondition: object[] = []

  if (searchTerm?.length) {
    andCondition.push({
      $or: searcheableFields.map((field: string) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  if (dateRange && dateRange?.startDate && dateRange?.endDate) {
    // console.log(dateRange, 'this is in')
    andCondition.push({
      createdAt: {
        $gte: dateRange?.startDate,
        $lte: dateRange?.endDate,
      },
    })
  }

  // Add isDeleted: false to where condition
  if (!isDeleted) {
    andCondition.push({
      isDeleted: false,
    })
  }

  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(pagination)

  if (customCondition) {
    andCondition.push(customCondition)
  }
  const sortCondition: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder
  }
  // console.log(andCondition, 'before')
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {}
  // console.log(whereCondition, 'after')

  return {
    whereCondition,
    page,
    limit,
    skip,
    sortCondition: sortCondition,
  }
}
