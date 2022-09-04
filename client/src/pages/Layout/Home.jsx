import React from "react";
import { usePost } from "../../context/postContext";
import { AiOutlineLike } from "react-icons/ai";
import { Avatar } from "flowbite-react";
import moment from "moment";
import { BsBook } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { marked } from "marked";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { BiShare } from "react-icons/bi";
import { FRONT_URL } from "../../constants";
const BlogPostCard = ({ post }) => {
  const { likePost } = usePost();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    title,
    url,
    content,
    post_id,
    keywords,
    username,
    cover_img,
    full_name,
    category,
    like_count,
    time_to_read,
    published_date,
  } = post;
  let published_time_ago = moment(published_date).fromNow();

  const handleLike = () => {
    // if no user alert - to send to login page
    if (!user) {
      Swal.fire({
        title: "You are not logged in.",
        text: "Please sign in to like this post",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Signin",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
    } else likePost(post_id);
  };

  const handleShare = () => {
    // share to clipboard
    navigator.clipboard.writeText(`${FRONT_URL}${url}`);
    Swal.fire({
      title: "Copied to clipboard",
      text: "Share this link with your friends",
      icon: "success",
    });
  };

  return (
    <div
      // to={`/${url}`}
      className="w-10/12 h-full p-4 flex flex-col  rounded-md shadow-sm justify-between hover:shadow-lg transition-all duration-300   "
    >
      <div className="w-full flex-1 flex flex-col justify-between">
        <Link to={`${url}`}>
          {/* cover image  */}
          <div className="w-full h-64 bg-gray-200 rounded-md">
            <img
              src={cover_img}
              alt="title"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          {/* title  */}
          <h3 className="text-3xl pt-5 font-medium">{title}</h3>
          <p className="flex gap-2 items-center text-sm pt-2 pb-5 text-gray-500">
            <BsBook className="text-lg" /> {time_to_read} min Read
          </p>
          {/* <p className="text-sm text-gray-500">{content}</p> */}
          <div
            className="default_style ds"
            dangerouslySetInnerHTML={{
              __html: marked.parse(post.content.substring(0, 400) + "......"),
            }}
          />
          <div className="flex gap-3 pt-4 items-center">
            {/* small rounded image */}
            <Avatar
              alt="User settings"
              img="/profile.jpg"
              size="md"
              rounded={true}
            />
            <div className="flex flex-col  ">
              <p className="text-sm text-gray-500">{full_name}</p>
              <p className="text-sm text-gray-500">{published_time_ago}</p>
            </div>
          </div>
        </Link>
        {/* keywords */}
        <div className="flex gap-2 pt-4 items-center">
          {keywords &&
            keywords.length > 0 &&
            keywords.map((words) => (
              <span
                className="text-sm text-gray-500 p-2 rounded-sm border "
                key={words}
              >
                {words}
              </span>
            ))}
        </div>
        {/* continue button */}
        <div className="flex pt-4 justify-between">
          <Link
            to={url}
            className="bg-blue-500 hover:bg-white hover:text-blue-500 border  text-white px-4 py-2 rounded-2xl"
          >
            Continue Reading
          </Link>
          <div className="flex gap-3 items-center">
            {/* like */}
            <div
              className="flex items-center gap-1 text-blue-700 hover:text-blue-500 cursor-pointer  "
              onClick={handleLike}
            >
              <AiOutlineLike className="text-xl" />
              <p>{like_count}</p>
            </div>
            {/* share button */}
            <button
              className="flex items-center gap-1 text-blue-700 hover:text-blue-500 cursor-pointer  "
              onClick={handleShare}
            >
              Share <BiShare />
            </button>
          </div>
        </div>
        {/* empty for gap  */}
        <div className="h-10"></div>
      </div>
    </div>
  );
};

const Home = () => {
  const { getPosts, posts, isError, errorMessage, successMessage } = usePost();

  return (
    <ul className="space-y-4  flex flex-col items-center ">
      {posts && posts.length > 0 ? (
        posts.map((post) => <BlogPostCard post={post} key={post.post_id} />)
      ) : (
        <p className="text-2xl text-gray-500">No posts found</p>
      )}
    </ul>
  );
};

export default Home;
