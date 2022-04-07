import { NavLink, Outlet } from "react-router-dom";

const Header = (props) => {
  if (!props.defaultAccount) return <Outlet />;

  return (
    <>
      <div className="w-full bg-purple-900 flex justify-center items-center text-white py-3 mb-5">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "underline underline-offset-4 mr-10"
              : "text-white opacity-30 mr-10 hover:opacity-100"
          }
        >
          Transition
        </NavLink>

        <NavLink
          to="/networks"
          className={({ isActive }) =>
            isActive
              ? "underline underline-offset-4 mr-10"
              : "text-white opacity-30 hover:opacity-100"
          }
        >
          {" "}
          Networks
        </NavLink>
      </div>
      <Outlet />
    </>
  );
};

export default Header;
