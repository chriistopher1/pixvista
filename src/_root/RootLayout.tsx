import { Outlet } from "react-router-dom";

import Topbar from "@/components/shared/Topbar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import BottomBar from "@/components/shared/BottomBar";

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSideBar />

      <section className="flex-1 h-full">
        <Outlet />
      </section>

      <BottomBar />
    </div>
  );
};

export default RootLayout;
