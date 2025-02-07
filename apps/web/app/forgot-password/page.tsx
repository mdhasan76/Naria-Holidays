/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "../../redux/apiSlice/authApiSlice";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import { Spinner } from "flowbite-react";

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  }: any = useForm();

  const onSubmit = (data: any) => {
    forgotPassword(data).then((res: any) => {
      if (res?.data?.statusCode === 200) {
        window.alert(
          res?.data?.message || "Check your email for reset instructions."
        );
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Forgot Password
      </h2>
      <div className="p-4 mb-5 text-blue-700 bg-blue-100 rounded-lg flex items-center dark:bg-blue-200 dark:text-blue-800">
        <Info className="h-5 w-5 mr-2" />
        <span>
          After clicking submit, you will receive a reset password link via your
          registered email.
        </span>
      </div>
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
          {...register("uid", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
          className={`shadow-xs bg-gray-50 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder="name@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <button
        disabled={isLoading}
        type="submit"
        className="mt-5 w-full disabled:bg-blue-300 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {isLoading ? <Spinner /> : "Send Reset Instructions"}
      </button>
      <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
        Remember your password?{" "}
        <Link
          href="/signin"
          className="text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
        >
          Go back to Login
        </Link>
      </p>
    </form>
  );
};

export default ForgotPassword;
