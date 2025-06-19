import { useNavigate, Link } from "react-router-dom";

import { MdOutlineLogout } from "react-icons/md";

import { Button } from "../ui/button";

import { useSignOutAccount } from "@/lib/react-query/queries";

import { useUserContext } from "@/context/AuthContext";
import { useEffect } from "react";
import Loader from "./Loader";

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const { mutateAsync: signOut, isSuccess, isPending } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <Link to="/" className="flex-1">
        <h2 className="h2-bold font-yellowTail sm:h1-bold ">PixVista</h2>
      </Link>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          disabled={isPending}
          className="shad-button_ghost"
          onClick={() => signOut()}
        >
          {isPending ? <Loader /> : <MdOutlineLogout className="text-2xl" />}
        </Button>
        <Link to={`/profile/${user.accountId}`} className="flex-center gap-3">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-8 w-8 rounded-full"
          />
        </Link>
      </div>
    </section>
  );
};

export default Topbar;
