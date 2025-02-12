/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useResetPasswordMutation } from "../../../redux/apiSlice/authApiSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const page = () => {
  const { token } = useParams();
  console.log(token, "this is id");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  }: any = useForm<any>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const onSubmit: SubmitHandler<any> = (data) => {
    resetPassword({
      newPassword: data.password,
      token: token as string | "",
    }).then((res: any) => {
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message);
        router.push("/signin");
      } else {
        toast.error(res?.error?.data?.message);
      }
    });
  };

  const password = watch("password");
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
      <div className="mb-5 relative">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-gray-600"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-5 relative">
        <label
          htmlFor="repeat-password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Confirm password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="repeat-password"
          className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value: string) =>
              value === password || "Passwords do not match",
          })}
        />
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-gray-600"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
};

export default page;
