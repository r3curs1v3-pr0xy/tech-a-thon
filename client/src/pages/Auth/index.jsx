import React from "react";
import { Outlet } from "react-router-dom";

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  );
};

export default Auth;
