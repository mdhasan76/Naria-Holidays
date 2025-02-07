// import { IGenericResponse, IUser } from "../../shared/interface";
// import { apiSlice } from "./apiSlice";

// export const userApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getUsers: builder.query<IGenericResponse<IUser[]>, string>({
//       query: (query) => `/users?${query}`,
//       providesTags: ["users"],
//     }),
//     getUserById: builder.query<IGenericResponse<IUser>, { userId: string }>({
//       query: ({ userId }) => `/users/${userId}`,
//       providesTags: ["users"],
//     }),
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     createUser: builder.mutation<IGenericResponse<IUser>, any>({
//       query: (payload) => ({
//         url: `/users/create`,
//         method: "POST",
//         body: payload,
//       }),
//       invalidatesTags: ["users"],
//     }),
//     updateUser: builder.mutation<
//       IGenericResponse<IUser>,
//       Partial<IUser & { userId: string }>
//     >({
//       query: (payload) => ({
//         url: `/users/${payload.userId}`,
//         method: "PATCH",
//         body: payload,
//       }),
//       invalidatesTags: ["users"],
//     }),
//     deleteUser: builder.mutation<
//       IGenericResponse<"success">,
//       { userId: string }
//     >({
//       query: (payload) => ({
//         url: `/users/${payload.userId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["users"],
//     }),
//   }),
// });

// export const {
//   useGetUsersQuery,
//   useLazyGetUsersQuery,
//   useCreateUserMutation,
//   useDeleteUserMutation,
//   useGetUserByIdQuery,
//   useLazyGetUserByIdQuery,
//   useUpdateUserMutation,
// } = userApiSlice;
