import React from "react";
import "./Header.css";

const Header = ({ title }) => {
  return (
    <header className="custom-header">
      <h1 className="header-text">{title}</h1>
    </header>
  );
};

export default Header;