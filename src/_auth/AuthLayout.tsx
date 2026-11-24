import { Outlet, Navigate } from "react-router-dom";
import { getToken } from "@/lib/api/config";

const AuthLayout = () => {
  const isAuthenticated = Boolean(getToken());

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex-center flex-1 py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/form-img.jpg"
            alt="logo"
            className="hidden xl:block w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
