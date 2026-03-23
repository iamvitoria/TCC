import React from "react";
import "./Header.css";

const Header = ({ title }) => {
  return (
    <header className="custom-header">
      <div className="circle-deco top-left"></div>
      <div className="circle-deco top-right"></div>
      <h1 className="header-text">{title}</h1>
    </header>
  );
};

export default Header;