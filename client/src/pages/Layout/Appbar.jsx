import { useAuth } from "../../context/AuthContext";
import { Avatar, Navbar, Dropdown } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

import { MdOutlineSearch } from "react-icons/md";
import { usePost } from "../../context/postContext";

const Appbar = () => {
  const { logout, user, token } = useAuth();
  const { searchPosts, getPosts } = usePost();
  const handleLogout = () => {
    logout();
  };

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }
  const handleSearch = (e) => {
    if (e.target.value.length > 1) searchPosts(e.target.value);
    else getPosts();
  };

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-4 rounded dark:bg-gray-900">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link to="/" className="flex items-center">
          <img
            src="/vite.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Blogger
          </span>
        </Link>
        {/* long search bar  */}
        <div className="hidden sm:block w-1/2">
          <div className="relative">
            <div className=" inline-flex items-center justify-center absolute left-0 top-0 h-full w-12 text-2xl text-gray-400">
              <MdOutlineSearch />
            </div>
            <input
              type="text"
              className="w-full h-12 pl-10 pr-4 rounded-2xl border border-gray-300 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Search for tags, article and many more "
              onChange={debounce((e) => handleSearch(e), 500)}
            />
          </div>
        </div>

        <div className="flex md:order-2">
          {!user ? (
            <div className="flex gap-2 justify-center">
              <Link to="/signin" className="mt-2 ">
                <button className="border p-2 px-4 rounded-3xl bg-blue-500 hover:bg-blue-400 text-white ">
                  Signin
                </button>
              </Link>
              <Link to="/signup" className="mt-2 ">
                <button className="border p-2 px-4 rounded-3xl bg-white text-blue-500 hover:bg-gray-100 ">
                  Signup
                </button>
              </Link>
            </div>
          ) : (
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <Avatar alt="User settings" img="/profile.jpg" rounded={true} />
              }
            >
              <Dropdown.Header>
                <>
                  <span className="block text-md">{user.full_name}</span>
                  <span className="block text-sm">( {user.username} )</span>
                  <span className="block truncate text-sm font-medium">
                    {user.email}
                  </span>
                </>
              </Dropdown.Header>
              {/* <Dropdown.Item>Dashboard</Dropdown.Item> */}
              {/* <Dropdown.Item>Settings</Dropdown.Item> */}
              {/* <Dropdown.Item>Earnings</Dropdown.Item> */}
              {token && (
                <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
              )}
            </Dropdown>
          )}
          {/* <Navbar.Toggle /> */}
        </div>
      </div>
    </nav>
  );
};

export default Appbar;
