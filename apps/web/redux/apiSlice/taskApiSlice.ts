import { IGenericResponse, ITask } from "../../shared/interface";
import { apiSlice } from "./apiSlice";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<IGenericResponse<ITask[]>, string>({
      query: (query) => `/tasks?${query}`,
      providesTags: ["tasks"],
    }),
    getTaskById: builder.query<IGenericResponse<ITask>, { taskId: string }>({
      query: ({ taskId }) => `/tasks/${taskId}`,
      providesTags: ["tasks"],
    }),
    getTaskStates: builder.query<IGenericResponse<any>, null>({
      query: () => `/tasks/states`,
      providesTags: ["tasks"],
    }),
    createTask: builder.mutation<IGenericResponse<ITask>, any>({
      query: (payload) => ({
        url: `/tasks`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["tasks"],
    }),
    updateTask: builder.mutation<
      IGenericResponse<ITask>,
      Partial<ITask & { taskId: string }>
    >({
      query: (payload) => ({
        url: `/tasks/${payload.taskId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["tasks"],
    }),
    deleteTask: builder.mutation<
      IGenericResponse<"success">,
      { taskId: string }
    >({
      query: (payload) => ({
        url: `/tasks/${payload.taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useLazyGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
  useLazyGetTaskByIdQuery,
  useUpdateTaskMutation,
  useGetTaskStatesQuery,
  useLazyGetTaskStatesQuery,
} = taskApiSlice;
