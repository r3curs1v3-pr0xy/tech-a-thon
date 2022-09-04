import React, { useEffect, useState } from "react";
import { FaAt, FaLock } from "react-icons/fa";
import InputField from "./InputField";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import { useNavigate, Link } from "react-router-dom";
import { Toast } from "../../components/Toast";
import CircularLoading from "../../components/Loading/CircularLoading";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const { token, login } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      Toast.fire({
        icon: "error",
        title: error,
      });
      setIsLoading(false);
    }
  }, [error, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let { status, message } = await login(formData);
    if (!status) {
      console.log(message);
      setError(message);
    } else {
      setIsLoading(false);
      setError(false);
    }
  };
  return (
    <>
      <div
        className="
        flex flex-col
        bg-white
        shadow-md
        px-4
        sm:px-6
        md:px-8
        lg:px-10
        py-8
        rounded-3xl
        w-50
        max-w-md
      "
      >
        <div className="font-medium self-center text-xl sm:text-3xl text-gray-800">
          Welcome
        </div>
        <div className="mt-4 self-center text-xl sm:text-sm text-gray-800">
          Enter your credentials to access your account
        </div>
        <div className="mt-10">
          <form onSubmit={handleSubmit}>
            <InputField
              label="User name:"
              name="username"
              value={formData.username}
              onChange={handleChange}
              Icon={FaAt}
              placeholder="Enter Your username"
              required
            />
            <InputField
              label="Password:"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              Icon={FaLock}
              EndIcon={showPassword ? MdVisibility : MdVisibilityOff}
              clickEndIcon={toggleShowPassword}
              placeholder="Enter Your Password"
              required
            />

            <div className="flex w-full">
              <button
                type="submit"
                className="
                    flex
                    mt-2
                    items-center
                    justify-center
                    focus:outline-none
                    text-white text-sm
                    sm:text-base
                    bg-blue-500
                    hover:bg-blue-600
                    rounded-2xl
                    py-2
                    w-full
                    transition
                    duration-150
                    ease-in
                    disabled:opacity-50
                  "
                disabled={isLoading}
              >
                <span className="mr-2 uppercase">Sign In</span>
                {isLoading ? (
                  <span>
                    <CircularLoading />
                  </span>
                ) : (
                  <span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-center items-center mt-6">
        <Link
          to="/signup"
          className="
              inline-flex
              items-center
              text-gray-700
              font-medium
              text-xs text-center
            "
        >
          <span className="ml-2">
            You don't have an account?
            <span className="text-xs ml-2 text-blue-500 font-semibold">
              Sign up
            </span>
          </span>
        </Link>
      </div>
    </>
  );
};

export default Login;
