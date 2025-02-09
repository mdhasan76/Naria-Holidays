import { Request, Response } from "express";
import httpStatus from "http-status";
import { TaskService } from "./task.service";
import { sendResponse } from "../../../shared/customResponse";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { TaskFilterableField } from "./task.constant";
import { ITask } from "./task.interface";
import { PaginationOptions } from "../../../interfaces/sharedInterface";

// create Task
const createTask = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  data.userId = req.user._id;
  const result = await TaskService.createTask(data);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Created task successfully",
    data: result,
  });
});

// Update Task
const updateTask = async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.params.id;
  const result = await TaskService.updateTask(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated Task Successfully",
    data: result,
  });
};

// Delete Task
const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TaskService.deleteTask(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete Task Successfully",
    data: result,
  });
});

// Get Task by pagination
const getTasks = catchAsync(async (req: Request, res: Response) => {
  const paginationOption = pick(req.query, PaginationOptions);

  const filters = pick(req.query, TaskFilterableField);
  filters["userId"] = req.user._id;
  const result = await TaskService.getTasks(filters, paginationOption);
  sendResponse<ITask[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Tasks Successfully",
    meta: result.meta,
    data: result.data,
  });
});

// get Task by id
const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TaskService.getTaskById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Task Success",
    data: result,
  });
});

// get Task by id
const getTaskStates = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getTaskStates(req.user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Task States Successfully",
    data: result,
  });
});

export const TaskController = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStates,
};
