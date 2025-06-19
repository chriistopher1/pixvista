import { LuHome } from "react-icons/lu";
import { MdOutlineExplore } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa6";
import { RiGalleryFill } from "react-icons/ri";

export const sidebarLinks = [
  {
    imgURL: <LuHome className="custom-icon" />,
    route: "/",
    label: "Home",
  },
  {
    imgURL: <MdOutlineExplore className="custom-icon" />,
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: <IoPeopleOutline className="custom-icon" />,
    route: "/allUsers",
    label: "People",
  },
  {
    imgURL: <FaRegBookmark className="custom-icon" />,
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: <RiGalleryFill className="custom-icon" />,
    route: "/createPost",
    label: "Create Post",
  },
];

export const bottombarLinks = [
  {
    imgURL: <LuHome className="custom-icon" />,
    route: "/",
    label: "Home",
  },
  {
    imgURL: <MdOutlineExplore className="custom-icon" />,
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: <FaRegBookmark className="custom-icon" />,
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: <RiGalleryFill className="custom-icon" />,
    route: "/createPost",
    label: "Create",
  },
];
