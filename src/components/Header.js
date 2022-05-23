import { NavLink, Outlet } from "react-router-dom";
import Logo from "../images/logo.png";
import { useState } from "react";
const Header = (props) => {
  const [isDropdown, setIsDropDown] = useState(true);

  const dropdownHandler = () => {
    setIsDropDown(!isDropdown);
  };
  if (!props.defaultAccount) return <Outlet />;

  return (
    <>
      <div className=" relative w-full bg-purple-900 flex justify-between items-center text-white py-1 mb-5">
        <div className="flex items-center">
          <img src={Logo} alt="logo" width={55} height={55} />
          <h1 className="hidden md:block font-bold text-2xl text-orange-500">
            NFT MARKETPLACE
          </h1>
        </div>
        <div className="flex gap-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "underline underline-offset-4 "
                : "text-white opacity-30 hover:opacity-100"
            }
          >
            {" "}
            Marketplace
          </NavLink>

          <NavLink
            to="/mint-nft"
            className={({ isActive }) =>
              isActive
                ? "underline underline-offset-4 "
                : "text-white opacity-30 hover:opacity-100"
            }
          >
            {" "}
            Mint NFT
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "underline underline-offset-4 "
                : "text-white opacity-30 hover:opacity-100"
            }
          >
            {" "}
            Dashboard
          </NavLink>

          <NavLink
            to="/my-nft"
            className={({ isActive }) =>
              isActive
                ? "underline underline-offset-4 "
                : "text-white opacity-30 hover:opacity-100"
            }
          >
            {" "}
            My NFT
          </NavLink>
        </div>

        <div className="mr-5">
          <button onClick={dropdownHandler}>
            <div className="flex items-center">
              <p className="hidden lg:block">{props.defaultAccount}</p>
              <svg
                className="w-9 h-9"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </button>

          <div
            className={
              isDropdown
                ? "hidden"
                : "absolute text-black bg-white  right-[20px] top-[63px] z-10 w-48 "
            }
          >
            <div className="hover:bg-purple-900 hover:text-white px-4 py-2 ">
              <NavLink to="/wallet" onClick={dropdownHandler}>
                Wallet
              </NavLink>
            </div>
            <div className="hover:bg-purple-900 hover:text-white px-4 py-2">
              <NavLink to="/networks" onClick={dropdownHandler}>
                {" "}
                Networks
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Header;
