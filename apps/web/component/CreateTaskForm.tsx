"use client";

import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useCreateTaskMutation } from "../redux/apiSlice/taskApiSlice";

enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

interface ITask {
  userId: string; // Assuming ObjectId is represented as a string in the form
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
}

export function CreateTaskForm({
  setShowModal,
}: {
  setShowModal: (show: boolean) => void;
}) {
  const [stayOnThisPage, setStayOnThisPage] = useState(false);
  const { register, handleSubmit } = useForm<ITask>({
    defaultValues: {
      status: TaskStatus.PENDING,
    },
  });
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const onSubmit = (data: ITask) => {
    createTask(data).then((res: any) => {
      if (res?.data?.statusCode === 201) {
        console.log(res?.data, "this is");
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
          <TextInput
            id="description"
            {...register("description", { required: true })}
            placeholder="Task description"
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
          Create Task
        </Button>
      </form>
    </div>
  );
}
