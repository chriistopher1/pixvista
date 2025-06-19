import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = true;

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
          ></img>
        </>
      )}
    </>
  );
};

export default AuthLayout;
