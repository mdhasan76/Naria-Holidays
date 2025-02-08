"use client";

import { useParams } from "next/navigation";
import { Card, Spinner, Badge } from "flowbite-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLazyGetTaskByIdQuery } from "../../../../redux/apiSlice/taskApiSlice";
import { Edit } from "lucide-react";
import PopupModal from "../../../../component/PopupModal";
import { UpdateTaskForm } from "../../../../component/UpdateTaskForm";

const TaskDetailsPage = () => {
  const params = useParams();
  const taskDataId = params.id as string;

  const [showEditModal, setShowEditModal] = useState(false);
  const [getTask, { data: taskData, isLoading, isError, error }] =
    useLazyGetTaskByIdQuery();
  const data: any = taskData?.data;
  console.log(data, "this is fetch data");
  useEffect(() => {
    getTask({ taskId: taskDataId }).then((res: any) => {
      if (res?.data?.statusCode === 200) {
        // setTaskData(res?.data?.data);
      } else {
        toast.error(res?.error?.data?.message);
      }
    });
  }, [taskDataId]);
  console.log(data, "this is task Data");
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>
          {(error as any)?.data?.message || "Failed to load taskData details"}
        </p>
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Task Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PopupModal open={showEditModal} setOpen={setShowEditModal}>
        <div className="w-[90%] sm:w-[60vw] mx-auto p-6 bg-white rounded-lg shadow-lg">
          <UpdateTaskForm task={data as any} setShowModal={setShowEditModal} />
        </div>
      </PopupModal>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{data?.title}</h1>
          <button
            onClick={() => {
              setShowEditModal(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Edit className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Description</h2>
            <p>{data?.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Status</h2>
            <Badge color={data?.status === "completed" ? "success" : "warning"}>
              {data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}
            </Badge>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Due Date</h2>
            <p>{new Date(data?.dueDate).toLocaleString()}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Created At</h2>
            <p>{new Date(data?.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Last Updated</h2>
            <p>{new Date(data?.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskDetailsPage;
