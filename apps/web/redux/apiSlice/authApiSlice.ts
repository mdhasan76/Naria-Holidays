import { IGenericResponse, IUser } from "../../shared/interface";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRefreshToken: builder.query({
      query: () => `/auth/refresh-token`,
    }),
    getUserData: builder.query({
      query: () => `/auth/profile`,
      providesTags: ["users"],
    }),
    updateUserProfile: builder.mutation<
      IGenericResponse<IUser>,
      Partial<IUser>
    >({
      query: (payload) => ({
        url: `/auth/profile`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    logIn: builder.mutation<
      IGenericResponse<IUser>,
      { uid: string; password: string }
    >({
      query: (payload) => ({
        url: `/auth/login`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    register: builder.mutation<IGenericResponse<IUser>, Partial<IUser>>({
      query: (payload) => ({
        url: `/auth/register`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    forgotPassword: builder.mutation<IGenericResponse<IUser>, { uid: string }>({
      query: (payload) => ({
        url: `/auth/forget-password`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    resetPassword: builder.mutation<IGenericResponse<IUser>, { uid: string }>({
      query: (payload) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    logOut: builder.mutation<IGenericResponse<"success">, null>({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useLogInMutation,
  useLogOutMutation,
  useRegisterMutation,
  useGetRefreshTokenQuery,
  useLazyGetRefreshTokenQuery,
  useForgotPasswordMutation,
  useGetUserDataQuery,
  useLazyGetUserDataQuery,
  useResetPasswordMutation,
  useUpdateUserProfileMutation,
} = userApiSlice;
