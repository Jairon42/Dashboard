import React from "react";
import '../styles/style.css';
import { FaSearch, FaUserCircle } from "react-icons/fa";


const Header = () => {
  return (
    <header className="header">
      <h1 className="title">📊 Dashboard</h1>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
        />
      </div>

      <button className="btn-user">
        <FaUserCircle size={28} />
      </button>
    </header>
  );
};

export default Header;
