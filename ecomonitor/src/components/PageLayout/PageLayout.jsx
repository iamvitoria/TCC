import React from "react";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";

const PageLayout = ({ title, children, isAdmin = false }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#2D4627" }}>
      <Header title={title} />
      
        <div style={{ 
            flex: 1, 
            backgroundColor: "white", 
            overflowY: "auto", 
            display: "flex",
            flexDirection: "column",
            width: "100%", 
        }}>
            {children}
        </div>

      <Navbar isAdmin={isAdmin} />

    </div>
  );
};

export default PageLayout;