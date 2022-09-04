import React, { createContext, useReducer } from "react";
import postApi from "../api/post";
// make a usePost hook
const PostContext = createContext();
const usePost = () => React.useContext(PostContext);

// make initial state
const initialState = {
  posts: [],
  myPosts: [],
  post: null,
  trendingPosts: [],
  category: [],
  isFetching: false,
  isError: false,
  errorMessage: "",
  successMessage: "",
};

// make a reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "GET_POST":
      return {
        ...state,
        post: action.payload,
        isFetching: false,
      };
    case "GET_POSTS":
      return {
        ...state,
        posts: action.payload.sort(
          (a, b) => new Date(b.published_date) - new Date(a.published_date)
        ),
      };
    case "SET_CATEGORY":
      return {
        ...state,
        // get category in array then make set to remove duplicate
        category: [...new Set(action.payload.map((post) => post.category))],
      };
    case "GET_MY_POSTS":
      return {
        ...state,
        myPosts: action.payload,
      };

    case "SET_TRENDING_POSTS":
      return {
        ...state,
        trendingPosts: action.payload.sort(
          (a, b) => b.like_count - a.like_count
        ),
      };
    case "UPDATE_POST_DETAIL":
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.post_id === action.payload.post_id) {
            return action.payload;
          }
          return post;
        }),
        trendingPosts: state.trendingPosts.map((post) => {
          if (post.post_id === action.payload.post_id) {
            return action.payload;
          }
          return post;
        }),
      };
    case "REMOVE_POST":
      return {
        ...state,
        posts: state.posts.filter((post) => post.post_id !== action.payload),
        myPosts: state.myPosts.filter(
          (post) => post.post_id !== action.payload
        ),
        trendingPosts: state.trendingPosts.filter(
          (post) => post.post_id !== action.payload
        ),
      };

    case "SUCCESS_MESSAGE":
      return {
        ...state,
        successMessage: action.payload,
      };
    case "ERROR_MESSAGE":
      return {
        ...state,
        isError: true,
        errorMessage: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        isError: false,
        errorMessage: "",
      };
    case "CLEAR_SUCCESS":
      return {
        ...state,
        successMessage: "",
      };

    default:
      return state;
  }
};

// make a provider
const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getPosts = async () => {
    try {
      const res = await postApi.getPosts();
      dispatch({ type: "GET_POSTS", payload: res.data });
      dispatch({ type: "SET_TRENDING_POSTS", payload: res.data });
      dispatch({ type: "SET_CATEGORY", payload: res.data });
    } catch (err) {
      dispatch({ type: "ERROR_MESSAGE", payload: err.response.data.msg });
    }
    clearMessage();
  };

  const searchPosts = async (q) => {
    try {
      const res = await postApi.searchPosts(q);
      console.log(res.data);
      if (!!res.data.msg) throw new Error(res.data.msg);
      dispatch({ type: "GET_POSTS", payload: res.data });
    } catch (err) {
      dispatch({ type: "GET_POSTS", payload: [] });
      dispatch({
        type: "ERROR_MESSAGE",
        payload: err.response.data.msg || err.message,
      });
    }
    clearMessage();
  };

  const getUpdatedPost = async (id) => {
    try {
      const res = await postApi.getPost(id);
      if (!!state.post) {
        dispatch({ type: "GET_POST", payload: res.data });
      }
      dispatch({ type: "UPDATE_POST_DETAIL", payload: res.data });
    } catch (err) {
      dispatch({ type: "ERROR_MESSAGE", payload: err.response.data.msg });
    }
  };

  const getPost = async (id) => {
    try {
      const res = await postApi.getPost(id);
      dispatch({ type: "GET_POST", payload: res.data });
    } catch (err) {
      dispatch({ type: "ERROR_MESSAGE", payload: err.response.data.msg });
    }
    clearMessage();
  };

  const getMyPosts = async () => {
    try {
      const res = await postApi.getMyPosts();
      dispatch({ type: "GET_MY_POSTS", payload: res.data });
    } catch (err) {
      dispatch({ type: "ERROR_MESSAGE", payload: err.response.data.msg });
    }
    clearMessage();
  };

  const createPost = async (data) => {
    try {
      const res = await postApi.createPost(data);
      dispatch({ type: "SUCCESS_MESSAGE", payload: res.data.msg });
    } catch (err) {
      dispatch({ type: "ERROR_MESSAGE", payload: err.response.data.msg });
    }
    clearMessage();
  };

  const updatePost = async (id, data) => {
    try {
      const res = await postApi.updatePost(id, data);
      dispatch({ type: "SUCCESS_MESSAGE", payload: res.data.msg });
    } catch (err) {
      dispatch({ type: "ERROR_MESSAGE", payload: err.response.data.msg });
    }
    clearMessage();
  };

  const deletePost = async (id) => {
    try {
      const res = await postApi.deletePost(id);
      dispatch({ type: "REMOVE_POST", payload: id });
      dispatch({ type: "SUCCESS_MESSAGE", payload: res.data.msg });
    } catch (err) {
      dispatch({ type: "ERROR_MESSAGE", payload: err.response.data.msg });
    }
    clearMessage();
  };

  const likePost = async (post_id) => {
    try {
      const res = await postApi.likePost(post_id);
      await getUpdatedPost(post_id);

      console.log(res);
      dispatch({ type: "SUCCESS_MESSAGE", payload: res.data.msg });
    } catch (err) {
      console.log(err.response);
      dispatch({ type: "ERROR_MESSAGE", payload: err.response.data.msg });
    }
    clearMessage();
  };

  const clearMessage = () => {
    console.log("clear called");
    setTimeout(() => {
      console.log("clear executed");
      dispatch({ type: "CLEAR_ERROR" });
      dispatch({ type: "CLEAR_SUCCESS" });
    }, 3000);
  };

  return (
    <PostContext.Provider
      value={{
        ...state,
        getPosts,
        likePost,
        createPost,
        getPost,
        searchPosts,
        getMyPosts,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export { PostProvider, usePost };
