import httpStatus from "http-status";
import { TaskSearchableFields } from "./task.constant";
import { ITask, ITaskFilters } from "./task.interface";
import ApiError from "../../../errors/ApiError";
import { searchHelper } from "../../../helpers/searchHelper";
import {
  IPaginationOption,
  IGenericResponse,
} from "../../../interfaces/sharedInterface";
import { TaskModel } from "./task.model";

// Create new Task
const createTask = async (data: ITask): Promise<ITask> => {
  const task = new TaskModel(data);
  await task.save();
  return task;
};
// Update task
const updateTask = async (
  id: string,
  payload: Partial<ITask>
): Promise<ITask | null> => {
  const result = await TaskModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update task");
  }
  return result;
};

// Get tasks by pagination
const getTasks = async (
  filters: ITaskFilters,
  pagination: IPaginationOption
): Promise<IGenericResponse<ITask[]>> => {
  const option = searchHelper(filters, pagination, TaskSearchableFields);

  const result = await TaskModel.find(option.whereCondition)
    .sort(option.sortCondition)
    .skip(option.skip)
    .limit(option.limit as number);
  const total = await TaskModel.countDocuments(option.whereCondition);

  return {
    meta: {
      limit: option.limit,
      page: option.page,
      total,
    },
    data: result,
  };
};

// Delete Task to DB
const deleteTask = async (taskId: string): Promise<string> => {
  const task = await TaskModel.findByIdAndUpdate(taskId, {
    isDeleted: true,
    deletedAt: new Date(),
  });
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
  }
  return "Success";
};

// Get single tasks
const getTaskById = async (id: string): Promise<ITask | null> => {
  const task = await TaskModel.findOne({ _id: id });
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
  }
  return task;
};

export const TaskService = {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getTaskById,
};
