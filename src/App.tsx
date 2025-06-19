import { Routes, Route } from "react-router-dom";

import RootLayout from "./_root/RootLayout";
import Home from "./_root/pages/Home";
import CreatePost from "./_root/pages/CreatePost";
import Saved from "./_root/pages/Saved";
import Explore from "./_root/pages/Explore";
import AllUsers from "./_root/pages/AllUsers";

import AuthLayout from "./_auth/AuthLayout";
import SignIn from "./_auth/form/SignIn";
import SignUp from "./_auth/form/SignUp";

import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import EditPost from "./_root/pages/EditPost";
import PostDetails from "./_root/pages/PostDetails";
import Profile from "./_root/pages/Profile";
import UpdateProfile from "./_root/pages/UpdateProfile";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signIn" element={<SignIn />}></Route>
          <Route path="/signUp" element={<SignUp />}></Route>
        </Route>

        <Route element={<RootLayout />}>
          <Route index element={<Home />} path="/" />
          <Route path="createPost" element={<CreatePost />} />
          
          <Route path="allUsers" element={<AllUsers />} />
          <Route path="saved" element={<Saved />} />
          <Route path="explore" element={<Explore />} />
          <Route path="updatePost/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/updateProfile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
