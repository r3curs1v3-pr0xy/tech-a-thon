import React from "react";
import { useEffect } from "react";
import { MdCancel } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import { usePost } from "../../context/postContext";
import TextEditor from "./TextEditor";
import * as filestack from "filestack-js";
import Swal from "sweetalert2";

const client = filestack.init(import.meta.env.VITE_FILE_STACK_API_KEY);

const PostEditor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    createPost,
    isError,
    errorMessage,
    successMessage,
    post,
    getPost,
    updatePost,
    deletePost,
  } = usePost();
  const params = useParams();

  const post_id = params.id;

  const [state, setState] = React.useState({
    title: "",
    content: "",
    keywords: "",
    category: "",
    coverImage: "",
    is_published: false,
  });
  const [isCategoryEnabled, setIsCategoryEnabled] = React.useState(false);
  const [isKeywordsEnabled, setIsKeywordsEnabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (post_id && post_id !== "create") {
      setIsLoading(true);
      getPost(post_id);
    }
  }, [post_id]);
  useEffect(() => {
    if (post && post.username !== user.username) {
      navigate("/");
    }
    if (post && post.username === user.username && post_id === post.post_id) {
      setIsCategoryEnabled(true);
      setIsKeywordsEnabled(true);
      setState({
        title: post.title,
        content: post.content,
        keywords: post.keywords.join(","),
        category: post.category,
        coverImage: post.cover_img,
        is_published: post.is_published,
      });
      setIsLoading(false);
    }
  }, [post_id, post]);

  const options = {
    accept: "image/*",
    maxFiles: 1,
    fromSources: ["local_file_system", "url"],
    onFileUploadFinished: (res) => {
      console.log(res);
      setState({ ...state, coverImage: res.url });
    },
    onFileUploadFailed: (res) => {
      console.log(res);
      Toast.fire({
        icon: "error",
        title: "Image upload failed",
      });
    },
  };

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, []);

  const toggleCategory = () => {
    setIsCategoryEnabled(!isCategoryEnabled);
  };

  const toggleKeywords = () => {
    setIsKeywordsEnabled(!isKeywordsEnabled);
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    let payload = {
      title: state.title,
      content: state.content,
      keywords: state.keywords.split(","),
      category: state.category,
      cover_img: state.coverImage,
      is_published: state.is_published,
    };
    if (post_id && post_id !== "create") {
      updatePost(post_id, payload);
    } else {
      createPost(payload);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost(post_id);
      }
    });
  };

  useEffect(() => {
    if (isError) {
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
      setIsLoading(false);
    }
    if (successMessage) {
      Toast.fire({
        icon: "success",
        title: successMessage,
      });
      setIsLoading(false);
      navigate("/");
    }
  }, [isError, successMessage]);

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
    </div>
  ) : (
    <div className="w-screen h-screen flex flex-col ">
      {/* Navbar */}
      <nav className="bg-gray-50 border-gray-200 px-2 sm:px-4 py-4 rounded dark:bg-gray-900">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <Link to="/" className="flex items-center">
            <img src="/vite.svg" className="mr-3 h-6 sm:h-9" alt=" Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Blogger
            </span>
          </Link>
          <div className="flex gap-2 md:order-2">
            {/* Delete Button */}
            {post_id && post_id !== "create" && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}

            {/* publish button */}
            <div className="flex items-center">
              <label
                for="default-toggle"
                className="inline-flex relative items-center  cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={state.is_published}
                  onChange={(e) =>
                    setState({ ...state, is_published: e.target.checked })
                  }
                  id="default-toggle"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Publish
                </span>
              </label>
            </div>
            {/* save button  */}
            <button
              className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Save
            </button>
            <button
              className=" hover:bg-blue-200 border border-blue-500 disabled:bg-gray-500 text-blue-500 font-bold py-2 px-4 rounded"
              onClick={handleBack}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </nav>
      {/* container max-width=1200px margin-auto */}
      <div className="container mx-auto mt-5 flex flex-col gap-3">
        {/* upload cover pic btn with popover menu  */}
        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={() => {
            client.picker(options).open();
          }}
        >
          Upload Cover Image <span className="text-red-500">(Required)</span>
        </button>
        {/* preview image */}
        {!!state.coverImage && (
          <div>
            <img
              src={state.coverImage}
              alt="cover_image"
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* category and keyword enabling button */}
        <div className="flex  gap-2">
          {!isCategoryEnabled && (
            <button
              className="bg-white hover:bg-gray-400 text-gray-500 hover:text-white rounded-2xl border transition font-bold py-2 px-4 "
              onClick={toggleCategory}
            >
              Add Category
            </button>
          )}
          {!isKeywordsEnabled && (
            <button
              className="bg-white hover:bg-gray-400 text-gray-500 hover:text-white rounded-2xl border transition font-bold py-2 px-4 "
              onClick={toggleKeywords}
            >
              Add Keyword
            </button>
          )}
        </div>
        {/* title */}
        <input
          type="text"
          name="title"
          id="title"
          value={state.title}
          onChange={handleChange}
          placeholder="Blog Title ..."
          className="w-full px-4 text-3xl mt-3  font-semibold placeholder:text-gray-500 placeholder:font-bold outline-none border-none focus:ring-0  focus:outline-none "
        />
        <div>
          {isKeywordsEnabled && (
            <div className="relative">
              <input
                type="text"
                name="keywords"
                id="keywords"
                value={state.keywords}
                onChange={handleChange}
                placeholder="Keywords (seperated by comma) "
                className="w-full px-4 text-2xl font-medium placeholder:text-gray-500 placeholder:font-semibold outline-none border-none focus:ring-0  focus:outline-none "
              />
              <div className="absolute top-0 right-0" onClick={toggleKeywords}>
                <MdCancel />
              </div>
            </div>
          )}
          {isCategoryEnabled && (
            <div className="relative">
              <input
                type="text"
                name="category"
                id="category"
                value={state.category}
                onChange={handleChange}
                placeholder="Enter category "
                className="w-full px-4 text-2xl font-medium placeholder:text-gray-500 placeholder:font-semibold outline-none border-none focus:ring-0  focus:outline-none "
              />
              <div className="absolute top-0 right-0" onClick={toggleCategory}>
                <MdCancel />
              </div>
            </div>
          )}
        </div>

        <TextEditor
          name="content"
          value={state.content}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PostEditor;
