"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserState, setUser } from "../redux/feature/userSlice";
import {
  selectCurrentUserState,
  setCredentials,
} from "../redux/feature/authSlice";
import { useLazyGetRefreshTokenQuery } from "../redux/apiSlice/authApiSlice";

const ProtectedRoute = ({ children }: { children: React.ReactNode }): any => {
  const userSate = useSelector(selectCurrentUserState);
  const dispatch = useDispatch();
  const [getRefreshToken, { isLoading, isError }] =
    useLazyGetRefreshTokenQuery();
  // console.log(userSate, "this is user");
  const router = useRouter();
  // const role = "admin";
  useEffect(() => {
    if (!isLoading && !userSate?.user?._id && !isError) {
      getRefreshToken("").then((res: any) => {
        if (res?.data?.statusCode === 200) {
          dispatch(setUser(res?.data?.data?.user));
          dispatch(setCredentials(res?.data?.data));
        }
      });
    }
  }, [userSate]);

  if (isLoading) {
    <div>Loading...</div>;
  }
  if (!userSate?.user?._id) {
    return router.push("/signin");
  }
  return <React.Fragment>{children}</React.Fragment>;
};

export default ProtectedRoute;
