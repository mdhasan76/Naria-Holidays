/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLogInMutation } from "../../redux/apiSlice/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  selectCurrentUserState,
  setCredentials,
} from "../../redux/feature/authSlice";
import { setUser } from "../../redux/feature/userSlice";
import toast from "react-hot-toast";
import { Eye, EyeClosed } from "lucide-react";

function page() {
  const [logIn] = useLogInMutation();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector(selectCurrentUserState);
  // console.log(userState, "this is kita");
  const route = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    if (userState?.user) {
      route.push("/task");
    }
  }, [userState]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit: any = (data: any) => {
    logIn(data).then((res: any) => {
      if (res?.data?.statusCode === 200) {
        dispatch(setUser(res?.data?.data?.user));
        dispatch(setCredentials(res?.data?.data));
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.error?.data?.message);
      }
    });
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          type="email"
          id="email"
          {...register("email", { required: true })}
          className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
          placeholder="name@flowbite.com"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your password
        </label>
        <div className="relative">
          <input
            {...register("password", { required: true })}
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            defaultValue={"hasanBhai"}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <Eye className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeClosed className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </button>
        </div>
        <div className="mt-1 text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
      <button
        type="submit"
        className=" mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Login
      </button>
      <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
        >
          Create an account from here
        </Link>
      </p>
    </form>
  );
}

export default page;
