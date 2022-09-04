import React from "react";
import { BsBook } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { usePost } from "../../context/postContext";
import { Avatar } from "flowbite-react";
import { AiOutlineLike } from "react-icons/ai";
import { marked } from "marked";
import { BiShare } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { FRONT_URL } from "../../constants";

const PostViewer = () => {
  const params = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { post, getPost, likePost } = usePost();
  React.useEffect(() => {
    getPost(params.id);
  }, [params.id]);
  const handleLike = () => {
    console.log("sjs", user);
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
    } else likePost(post.post_id);
  };

  const handleShare = () => {
    // share to clipboard
    navigator.clipboard.writeText(`${FRONT_URL}${post.url}`);
    Swal.fire({
      title: "Copied to clipboard",
      text: "Share this link with your friends",
      icon: "success",
    });
  };

  return (
    post && (
      <div
        // to={`/${url}`}
        className="w-full h-full p-4 flex flex-col  justify-between    "
      >
        <div className="w-full flex-1 flex flex-col justify-between">
          {/* cover image  */}
          <div className="w-full h-64 bg-gray-200 rounded-md">
            <img
              src={post.cover_img}
              alt="title"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          {/* title  */}
          <h3 className="text-3xl pt-5 font-medium">{post.title}</h3>
          <p className="flex gap-2 items-center text-sm pt-2 pb-5 text-gray-500">
            <BsBook className="text-lg" /> {post.time_to_read} min Read
          </p>
          {/* keywords */}
          <div className="flex gap-2 pt-4 items-center">
            {post.keywords &&
              post.keywords.length > 0 &&
              post.keywords.map((words) => (
                <span
                  className="text-sm text-gray-500 p-2 rounded-sm border "
                  key={words}
                >
                  {words}
                </span>
              ))}
          </div>
          <div
            className="default_style ds"
            dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }}
          />
          {/* empty div */}
          <div className="h-10"></div>

          <div className="flex justify-between ">
            <div className="flex gap-3 pt-4 items-center">
              {/* small rounded image */}
              <Avatar
                alt="User settings"
                img="/profile.jpg"
                size="md"
                rounded={true}
              />
              <div className="flex flex-col  ">
                <p className="text-sm text-gray-500">{post.full_name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.published_date).toDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              {/* like */}
              <div
                className="flex items-center gap-1 text-blue-700 hover:text-blue-500 cursor-pointer  "
                onClick={handleLike}
              >
                <AiOutlineLike className="text-xl" />
                <p>{post.like_count}</p>
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
    )
  );
};

export default PostViewer;
