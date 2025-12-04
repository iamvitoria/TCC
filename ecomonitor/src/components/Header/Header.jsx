import React from "react";
import "./Header.css";

export function Header({ title }) {
  return (
    <header className="custom-header">
      {/* Decoração simples (círculos) para não precisar de imagens externas */}
      <div className="circle-deco top-left"></div>
      <div className="circle-deco top-right"></div>
      
      <h1 className="header-text">{title}</h1>
    </header>
  );
}