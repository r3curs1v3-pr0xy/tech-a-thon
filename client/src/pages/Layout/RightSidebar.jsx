import { Avatar } from "flowbite-react";
import moment from "moment";
import React from "react";
import { AiOutlineLike } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePost } from "../../context/postContext";
import { CategoryBox } from "./LeftSidebar";

const BlogPostCard = ({ post }) => {
  let published_time_ago = moment(post.published_date).fromNow();

  return (
    <Link
      to={`${post.url}`}
      className="w-10/12 p-4 flex  gap-3 rounded-md  border-b justify-between hover:shadow-lg transition-all duration-300 cursor-pointer "
    >
      <div className="w-12 h-12">
        <Avatar
          alt="User settings"
          img={post.cover_img}
          size="md"
          rounded={true}
        />
      </div>
      <div className="w-full flex-1 flex flex-col justify-between">
        <h3 className="text-xl  font-medium">{post.title}</h3>
        <p className="text-md  text-gray-500"> {post.full_name}</p>
        {/* likes */}
        <div className="flex items-center gap-5 pt-1 text-lg text-gray-500">
          <div className="text-sm text-gray-500">{published_time_ago}</div>
          <div className="flex gap-1  text-md text-blue-700">
            <AiOutlineLike className="text-2xl" />
            <p> {post.like_count}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const RightSidebar = () => {
  const { trendingPosts } = usePost();
  const { user } = useAuth();
  return (
    <aside className="w-full relative " aria-label="Sidebar">
      {user ? (
        <div className="overflow-y-auto w-96 h-[89vh] absolute top-3 left-3 py-4 px-3 bg-white rounded-md dark:bg-gray-800">
          <div className="w-full  p-1 flex justify-between items-center ">
            <h3 className="text-3xl font-semibold right_sidebar_heading ">
              Trending
            </h3>
            <div className="p-2 px-4 rounded-4xl border">See All</div>
          </div>
          <ul className="space-y-1">
            {trendingPosts.map((post) => (
              <BlogPostCard post={post} key={post.post_id} />
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className="overflow-y-auto w-96 h-[56vh] absolute top-3 left-3 py-4 px-3 bg-white rounded-md dark:bg-gray-800">
            <div className="w-full  p-1 flex justify-between items-center ">
              <h3 className="text-3xl font-semibold right_sidebar_heading ">
                Trending
              </h3>
              <div className="p-2 px-4 rounded-4xl border">See All</div>
            </div>
            <ul className="space-y-1">
              {trendingPosts.map((post) => (
                <BlogPostCard post={post} key={post.post_id} />
              ))}
            </ul>
          </div>
          <CategoryBox
            style={{
              width: "24rem",
              top: "58vh",
              left: "12px",
            }}
          />
        </>
      )}
    </aside>
  );
};

export default RightSidebar;
