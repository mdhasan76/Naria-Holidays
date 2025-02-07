import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { logOut, setCredentials } from "../feature/authSlice";
const apiURL = process.env.NEXT_PUBLIC_SERVER_URL;

const baseQuery: BaseQueryFn = fetchBaseQuery({
  baseUrl: `${apiURL}/api/v1`,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as any).auth?.accessToken;
    // console.log(accessToken, "this is token");
    if (accessToken) {
      headers.set("authorization", `bearer ${accessToken}`);
    }
    return headers;
  },
  credentials: "include",
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Parameter 'args' implicitly has an 'any' type
const baseQueryWithReAuth = async (args, api, extraOption) => {
  // console.log("is this inital api hit?");
  let result: any = await baseQuery(args, api, extraOption);
  console.log(result, "this is result in base query");
  if (result?.error?.status === 401) {
    console.log("got error");
    // hit api to get refresh token again
    const getRefreshToken: any = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOption
    );
    // console.log(result, "this is result");
    if (getRefreshToken?.data?.data?.accessToken) {
      // store the new token
      api.dispatch(setCredentials(getRefreshToken?.data?.data));

      // retry the original query with the new access token
      result = baseQuery(args, api, extraOption);
      if (result?.error) {
        console.log(result?.error);
        toast.error("Got error in base query");
      }
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["users", "tasks"],
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({}),
});
