import React from "react";
import { Link } from "react-router-dom";
import '../styles/style.css';
import { FaHome, FaChartBar, FaProjectDiagram, FaUser, FaUsers } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/">
              <FaHome className="nav-icon" /> <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="projects">
              <FaProjectDiagram className="nav-icon" /> <span>Projects</span>
            </Link>
          </li>
          <li>
            <Link to="/workers">
              <FaUsers className="nav-icon" /> <span>Workers</span>
            </Link>
          </li>
          <li><FaChartBar className="nav-icon" /> <span>Stats</span></li>
          <li><FaUser className="nav-icon" /> <span>Profile</span></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
