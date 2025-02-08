"use client";

import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../redux/apiSlice/taskApiSlice";
import { Textarea } from "@headlessui/react";
import type React from "react"; // Added import for React

enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

interface ITask {
  _id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string; // Changed to string for easier handling with input type="date"
  status: TaskStatus;
}

interface UpdateTaskFormProps {
  task: ITask;
  setShowModal: (show: boolean) => void;
}

export function UpdateTaskForm({ task, setShowModal }: UpdateTaskFormProps) {
  const [stayOnThisPage, setStayOnThisPage] = useState(false);
  const { register, handleSubmit } = useForm<ITask>({
    defaultValues: {
      ...task,
      dueDate: new Date(task.dueDate).toISOString().split("T")[0], // Format date for input
    },
  });
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const onSubmit = (data: ITask) => {
    updateTask({ taskId: task._id, ...data } as any).then((res: any) => {
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message);
        if (!stayOnThisPage) {
          setShowModal(false);
        }
      } else {
        toast.error(res?.error?.data?.message);
      }
    });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <TextInput
            id="title"
            {...register("title", { required: true })}
            placeholder="Task title"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description", { required: true })}
            placeholder="Task description"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <TextInput
            id="dueDate"
            type="date"
            {...register("dueDate", { required: true })}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select {...register("status")}>
            <option value={TaskStatus.PENDING}>Pending</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="stayOnPage"
            checked={stayOnThisPage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStayOnThisPage(e.target.checked)
            }
          />
          <Label htmlFor="stayOnPage">Stay on this page</Label>
        </div>

        <Button type="submit" disabled={isLoading}>
          Update Task
        </Button>
      </form>
    </div>
  );
}
