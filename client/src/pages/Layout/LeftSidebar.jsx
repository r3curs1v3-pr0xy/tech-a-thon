import React from "react";
import { FaHandPointLeft } from "react-icons/fa";
import { BsNewspaper } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { usePost } from "../../context/postContext";

const Menu = ({ Icon, label, linkTo = "/", onClick, active }) => {
  return (
    <li>
      <NavLink
        to={linkTo}
        className={`flex items-center p-2 py-2 text-lg font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
        ${active && "border text-blue-500 border-blue-500"}`}
      >
        {Icon && <Icon className="text-xl" />}
        <span className="ml-3 flex-1 whitespace-nowrap" onClick={onClick}>
          {label}
        </span>
        {active && (
          <span className="inline-flex justify-center items-center p-3 ml-3  h-3 text-sm font-medium">
            <FaHandPointLeft className="text-blue-500" />
          </span>
        )}
      </NavLink>
    </li>
  );
};

const LeftSidebar = () => {
  return (
    <aside className="w-full relative " aria-label="Sidebar">
      <div
        className="overflow-y-auto w-52 absolute top-3 right-3 py-4 px-3 bg-white rounded dark:bg-gray-800"
        style={{
          backgroundColor: "rgb(248, 249, 250)",
        }}
      >
        <ul className="space-y-1">
          <Menu Icon={BsNewspaper} label="Feed" linkTo="/" />
          <Menu Icon={BsNewspaper} label="Create Post" linkTo="/blog/create" />
          <Menu Icon={BsNewspaper} label="My Posts" linkTo="/myposts" />
        </ul>
      </div>
      <CategoryBox />
    </aside>
  );
};

export const CategoryBox = ({ style }) => {
  const { category, searchPosts, getPosts } = usePost();
  const [seslectedCategory, setSeslectedCategory] = React.useState("");

  const handleClick = (val) => {
    console.log(val);
    if (val === seslectedCategory) {
      getPosts();
      setSeslectedCategory("");
      return;
    }
    searchPosts(val);
    setSeslectedCategory(val);
  };

  return (
    <div
      className="overflow-y-auto w-52 absolute top-48 right-3 py-4 px-3 bg-white rounded dark:bg-gray-800"
      style={{
        backgroundColor: "rgb(248, 249, 250)",
        ...style,
      }}
    >
      {/* category heading */}
      <h3 className="text-lg p-2 font-semibold text-gray-700 dark:text-gray-200">
        Categories
      </h3>
      <ul className="space-y-1">
        {category &&
          category.length > 0 &&
          category.map((cat) => (
            <Menu
              label={cat}
              linkTo="/"
              key={cat}
              onClick={() => handleClick(cat)}
              active={seslectedCategory === cat}
            />
          ))}
      </ul>
    </div>
  );
};

export default LeftSidebar;
