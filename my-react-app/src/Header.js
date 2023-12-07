import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

// Import icons
import { FaList, FaRegHeart } from "react-icons/fa";
import {
  FiHome,
  FiLogOut,
  FiArrowLeftCircle,
  FiArrowRightCircle,
} from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";
import { useAuth0 } from "@auth0/auth0-react";
import About from "./About";
import { Link } from "react-router-dom";

// Import the styles directly. Use the correct path in your project.
// import "react-pro-sidebar/dist/styles";

import "./index.css";

const Header = () => {
  const [menuCollapse, setMenuCollapse] = useState(false);
  const { logout, isAuthenticated } = useAuth0();

  const menuIconClick = () => {
    setMenuCollapse(!menuCollapse);
  };

  return (
    <div id="header">
      <Sidebar collapsed={menuCollapse}>
        <div className="sidebar-header">
          <div className="closemenu" onClick={menuIconClick}>
            {menuCollapse ? <FiArrowRightCircle /> : <FiArrowLeftCircle />}
          </div>
        </div>
        <div className="sidebar-content">
          <Menu iconShape="square">
            <Link to="/">
              <MenuItem icon={<FiHome />}>Home</MenuItem>
            </Link>
            <Link to="/about">
              <MenuItem icon={<RiPencilLine />}>About</MenuItem>
            </Link>
            {/* Add links to other routes as needed */}
            {isAuthenticated && (
              <MenuItem icon={<FiLogOut />} onClick={logout}>
                Sign Out
              </MenuItem>
            )}
          </Menu>
        </div>
      </Sidebar>
    </div>
  );
};

export default Header;
