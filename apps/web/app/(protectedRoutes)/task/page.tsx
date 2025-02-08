"use client";
import React, { useEffect, useState } from "react";
import {
  useDeleteTaskMutation,
  useGetTaskStatesQuery,
  useLazyGetTasksQuery,
} from "../../../redux/apiSlice/taskApiSlice";
import PopupModal from "../../../component/PopupModal";
import { CreateTaskForm } from "../../../component/CreateTaskForm";
import { UpdateTaskForm } from "../../../component/UpdateTaskForm";
import { ITask } from "../../../shared/interface";
import toast from "react-hot-toast";

const User = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask>();
  const [deleteTask] = useDeleteTaskMutation();
  const [getTasks, { data }] = useLazyGetTasksQuery();
  const tasks = data?.data;
  const { data: TaskStatesD } = useGetTaskStatesQuery(null);
  const taskStatesData = TaskStatesD?.data;
  console.log(taskStatesData, "this is states data");

  const taskList = [
    { taskName: "Hasan", status: "Active", role: "Admin" },
    { taskName: "Esmail", status: "Inactive", role: "User" },
    { taskName: "Shanto", status: "Pending", role: "Admin" },
    { taskName: "Ali Hossain", status: "Active", role: "Admin" },
  ];
  console.log(selectedTask, "this is selected task");
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const confirm = window.confirm("Are you sure to delete the task?");
    if (!confirm) {
      return;
    }
    deleteTask({ taskId }).then((res: any) => {
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.error?.data?.message);
      }
    });
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let query = "";
      if (searchTerm?.length > 0) {
        query = `searchTerm=${searchTerm}`;
      }
      getTasks(query && query);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, getTasks]);
  return (
    <div className="space-y-6">
      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {taskStatesData?.map(
          (stat: { name: string; total: number }, index: number) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-md"
            >
              <p className="text-sm font-medium text-gray-600">{stat?.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat?.total}</p>
            </div>
          )
        )}
      </div>

      {/* Toolbar Section */}
      <div className="flex items-center justify-between px-4">
        <div className="mb-3 inline-block">
          <form className="max-w-md">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Mockups, Logos..."
                required
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Create Task
        </button>
      </div>

      {/* Modal for Create User Form */}
      <PopupModal open={showModal} setOpen={setShowModal}>
        <div className="w-[90%] sm:w-[60vw] mx-auto p-6 bg-white rounded-lg shadow-lg">
          <CreateTaskForm setShowModal={setShowModal} />
        </div>
      </PopupModal>
      <PopupModal open={showEditModal} setOpen={setShowEditModal}>
        <div className="w-[90%] sm:w-[60vw] mx-auto p-6 bg-white rounded-lg shadow-lg">
          <UpdateTaskForm
            task={selectedTask as any}
            setShowModal={setShowEditModal}
          />
        </div>
      </PopupModal>

      {/* User Table Section */}
      <div className="px-4">
        <div className="relative overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">CreatedAt</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks?.map((task, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {task?.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(
                        task?.status
                      )}`}
                    >
                      {task?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(task?.createdAt as Date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id.toString())}
                      className="text-red-600 hover:underline "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {taskList.length === 0 && (
            <div className="p-4 text-center text-gray-500">No tasks found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
