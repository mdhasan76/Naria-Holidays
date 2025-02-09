"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUserState } from "../redux/feature/authSlice";
import { User2 } from "lucide-react";
import { useLogOutMutation } from "../redux/apiSlice/authApiSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userSate = useSelector(selectCurrentUserState);
  const dispatch = useDispatch();
  const router = useRouter();
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const [logOutUser] = useLogOutMutation();
  const handleLogOut = () => {
    logOutUser(null).then((res: any) => {
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message);
        dispatch(logOut());
        router.push("/signin");
        router.refresh();
      } else {
        toast.error(res?.error?.data?.message);
      }
    });
  };
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 sticky top-0 left-0 z-10">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <a
          href="https://mdhasan-portfolio.netlify.app/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            height={100}
            width={100}
            src={"https://cdn-icons-png.flaticon.com/512/906/906334.png"}
            className="h-8 w-8 object-cover object-center"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            NH Task
          </span>
        </a>
        <div className="flex items-center space-x-8">
          <ul className="hidden md:flex font-medium space-x-8 rtl:space-x-reverse">
            <li>
              <Link
                href="/"
                className="py-2 px-3 bg-blue-700 text-white rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
              >
                Home
              </Link>
            </li>
            {userSate?.user?._id && (
              <>
                <li>
                  <Link
                    href="/profile"
                    className="py-2 px-3 text-gray-900 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/task"
                    className="py-2 px-3 text-gray-900 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    My Task
                  </Link>
                </li>
              </>
            )}
            <li>
              {/* <Link
                  href="/register"
                  className="py-2 px-3 text-gray-900 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  SignUp
                </Link> */}
              {!userSate?.user?._id && (
                <Link
                  href="/signin"
                  className="py-2 px-3 text-gray-900 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>

          {/* User Profile Section */}
          {userSate?.user && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {userSate?.user?.displayImage ? (
                  <Image
                    height={40}
                    width={40}
                    src={userSate?.user?.displayImage}
                    className="h-10 w-10 rounded-full object-cover object-center"
                    alt="User Profile"
                  />
                ) : (
                  <User2 height={40} width={40} />
                )}

                <span className="hidden md:block text-gray-900 dark:text-white">
                  {userSate?.user?.userName}
                </span>
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-gray-800">
                  <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogOut}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
