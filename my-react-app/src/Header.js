import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { logout, isAuthenticated } = useAuth0();
  console.log("Is Authenticated:", isAuthenticated);

  const signOutButton = isAuthenticated ? (
    <li>
      <button onClick={logout}>Sign Out</button>
    </li>
  ) : null;

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-slate-800">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              {/* Replace with your menu icon */}
              {/* SVG icon here */}
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 text-lg font-bold">
            Audible Assistant
          </div>
          <div className="flex-none lg:flex">
            <ul className="menu menu-horizontal flex-1 justify-end">
              {/* Navbar menu content here */}
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/Directions">Directions</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              {signOutButton}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
