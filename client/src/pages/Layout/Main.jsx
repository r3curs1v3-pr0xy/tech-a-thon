import React from "react";
import RightSidebar from "./RightSidebar";
import LeftSidebar from "./LeftSidebar";
import { usePost } from "../../context/postContext";
import { useEffect } from "react";
import { Toast } from "../../components/Toast";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Main = () => {
  const { getPosts, isError, errorMessage, successMessage } = usePost();

  const { token } = useAuth();

  React.useEffect(() => {
    getPosts();
    console.log("first render");
  }, []);

  useEffect(() => {
    console.log("rendered");
    if (isError) {
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
    if (!!successMessage) {
      console.log("success");
      Toast.fire({
        icon: "success",
        title: successMessage,
      });
    }
  }, [isError, successMessage]);

  return (
    <div className="flex-1 flex  bg-gray-100">
      {token ? (
        <div className=" hidden md:block w-1/5 bg-gray-100 ">
          <LeftSidebar />
        </div>
      ) : (
        <div className=" hidden md:block w-1/6 bg-gray-100 "></div>
      )}
      <div className="flex-1">
        <div className="w-full relative " aria-label="Sidebar">
          <div className="overflow-y-auto w-full h-[89vh] absolute top-3  py-4 px-3 bg-white rounded-md dark:bg-gray-800">
            <Outlet />
          </div>
        </div>
      </div>
      <div className=" hidden md:block w-2/6 bg-gray-100 ">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Main;
