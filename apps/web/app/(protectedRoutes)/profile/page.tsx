/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUserState } from "../../../redux/feature/authSlice";
import Image from "next/image";
import { User2 } from "lucide-react";

const page = () => {
  const { user: userData } = useSelector(selectCurrentUserState);
  // const [userData, setUserData] = useState({})
  // console.log(userData);
  const updateProfile = () => {
    console.log("heelo");
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
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
        <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default page;
