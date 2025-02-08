/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUserState,
  setCredentials,
  setUserInAuth,
} from "../../../redux/feature/authSlice";
import Image from "next/image";
import { User2 } from "lucide-react";
import PopupModal from "../../../component/PopupModal";
import { useUpdateUserProfileMutation } from "../../../redux/apiSlice/authApiSlice";
import { useForm } from "react-hook-form";
import { IUser } from "../../../shared/interface";
import toast from "react-hot-toast";
import { setUser } from "../../../redux/feature/userSlice";

const page = () => {
  const [showModal, setShowModal] = useState(false);
  const [editProfile] = useUpdateUserProfileMutation();
  const dispatch = useDispatch();
  const { user: userData } = useSelector(selectCurrentUserState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    defaultValues: {
      ...userData,
    },
  });
  // const [userData, setUserData] = useState({})
  // console.log(userData);
  const onSubmit = (data: IUser) => {
    editProfile(data as any).then((res: any) => {
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message);
        dispatch(setUserInAuth(res?.data?.data));
        dispatch(setUser(res?.data?.data));
        setShowModal(false);
      } else {
        toast.error(res?.error?.data?.message);
      }
    });
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Modal for Create User Form */}
      <PopupModal open={showModal} setOpen={setShowModal}>
        <div className="w-[90%] sm:w-[60vw] mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
              Edit Profile
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-5">
                <label
                  htmlFor="displayImage"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Image URL
                </label>
                <input
                  type="text"
                  id="displayImage"
                  className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                  {...register("displayImage", {
                    required: "Image URL is required",
                  })}
                />
                {errors.displayImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.displayImage.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-lg font-medium text-gray-700"
                  htmlFor="userName"
                >
                  Username
                </label>
                <input
                  {...register("userName", {
                    required: "Username is required",
                  })}
                  type="text"
                  id="userName"
                  className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.userName && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-lg font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                  })}
                  type="email"
                  id="email"
                  className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </PopupModal>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">User Profile</h2>
      </div>

      <div className="flex items-center justify-between space-x-8">
        <div className="w-1/3">
          {userData?.displayImage ? (
            <Image
              src={userData?.displayImage}
              alt={`${userData?.userName}'s Profile`}
              width={128}
              height={128}
              className="rounded-full object-cover mx-auto"
            />
          ) : (
            <User2 height={100} width={100} />
          )}
        </div>

        <div className="w-2/3">
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700">
              <strong>Username:</strong> {userData?.userName}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700">
              <strong>Email:</strong> {userData?.email}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700">
              <strong>Member since:</strong>{" "}
              {new Date(userData?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-700">
              <strong>Last Updated:</strong>{" "}
              {new Date(userData?.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default page;
