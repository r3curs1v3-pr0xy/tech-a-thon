import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./pages/Layout";
import { PostProvider } from "./context/postContext";
import PostEditor from "./pages/PostEditor";
import Home from "./pages/Layout/Home";
import PostViewer from "./pages/Layout/PostViewer";
import MyPosts from "./pages/Layout/MyPosts";

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Routes>
          <Route path="/" element={<Auth />}>
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Register />} />
          </Route>

          <Route path="/blog/create" element={<PostEditor />} />
          <Route path="blog/:id/edit" element={<PostEditor />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="myposts" element={<MyPosts />} />
            <Route path="blog/:id/:name" element={<PostViewer />} />
          </Route>
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
