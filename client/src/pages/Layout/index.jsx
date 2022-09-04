import React from "react";
import Main from "./Main";
import Appbar from "./Appbar";

const Layout = () => {
  return (
    <div className="w-screen h-screen flex flex-col ">
      {/* Navbar */}
      <Appbar />
      {/* Main */}
      <Main />
    </div>
  );
};

export default Layout;
