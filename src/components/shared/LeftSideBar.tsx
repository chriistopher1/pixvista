import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import Loader from "./Loader";
import { sidebarLinks } from "@/constant";
import { INavLink } from "@/types";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useEffect } from "react";
import { MdOutlineLogout } from "react-icons/md";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isLoading } = useUserContext();

  const { mutateAsync: signOut, isSuccess, isPending } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="leftsidebar">
      <Link to="/">
        <h2 className="h2-bold font-yellowTail sm:h1-bold ">PixVista</h2>
      </Link>
      {isLoading || !user.email ? (
        <div className="h-14">
          <Loader />
        </div>
      ) : (
        <Link
          to={`/profile/${user.accountId}`}
          className="flex gap-3 items-center"
        >
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-12 w-12 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-orange-100">@{user.username}</p>
          </div>
        </Link>
      )}

      <ul className="flex flex-col gap-3 mt-4 flex-1">
        {sidebarLinks.map((link: INavLink) => {
          const isActive = pathname === link.route;

          return (
            <li
              key={link.label}
              className={`leftsidebar-link group ${isActive && "bg-orange-6"}`}
            >
              <NavLink to={link.route} className="flex gap-4 items-center p-4">
                {link.imgURL}
                {link.label}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <Button
        onClick={() => signOut()}
        disabled={isPending}
        className="flex gap-4 items-center p-4 hover:text-white justify-start w-full hover:bg-orange-6"
      >
        {isPending ? (
          <>
            <Loader /> Loading..
          </>
        ) : (
          <>
            <MdOutlineLogout className="text-xl" />
            <p className="base-medium">Logout</p>
          </>
        )}
      </Button>
    </section>
  );
};

export default LeftSideBar;
