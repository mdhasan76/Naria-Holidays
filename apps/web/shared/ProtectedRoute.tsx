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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userState = useSelector(selectCurrentUserState);
  const dispatch = useDispatch();
  const [getRefreshToken, { isLoading, isError }] =
    useLazyGetRefreshTokenQuery();
  const router = useRouter();

  useEffect(() => {
    if (!userState?.user?._id && !isError) {
      getRefreshToken("").then((res: any) => {
        if (res?.data?.statusCode === 200) {
          dispatch(setUser(res?.data?.data?.user));
          dispatch(setCredentials(res?.data?.data));
        } else {
          router.push("/signin");
        }
      });
    }
  }, [userState, isError, getRefreshToken, dispatch, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
