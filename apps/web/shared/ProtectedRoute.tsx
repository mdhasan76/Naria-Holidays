/* eslint-disable react-hooks/exhaustive-deps */
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
  const userState = useSelector(selectCurrentUserState);
  const dispatch = useDispatch();
  const [getRefreshToken, { isLoading, isError }] =
    useLazyGetRefreshTokenQuery();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !userState?.user?._id && !isError) {
      getRefreshToken("").then((res: any) => {
        if (res?.data?.statusCode === 200) {
          dispatch(setUser(res?.data?.data?.user));
          dispatch(setCredentials(res?.data?.data));
        }
      });
    }
  }, [userState]);

  if (isLoading) {
    <div>Loading...</div>;
  }
  if (!userState?.user?._id) {
    return router.push("/signin");
  }
  return <React.Fragment>{children}</React.Fragment>;
};

export default ProtectedRoute;
