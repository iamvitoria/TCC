import React from "react";
import picture from "../assets/picture.png"; 
import Navbar from "../components/Navbar/Navbar";
import { Header } from "../components/Header/Header"; 

const Home = () => {
  return (
    <div className="full-screen-layout">
      
      {/* 1. A IMAGEM DE FUNDO (Background) */}
      <img src={picture} alt="Fundo" className="bg-image" />

      {/* 2. HEADER (Fica por cima da imagem) */}
      <div className="overlay-header">
        <Header title="EcoMonitor" showBack={false} />
      </div>

      {/* 3. NAVBAR (Fica por cima da imagem) */}
      <Navbar />
      
    </div>
  );
};

export default Home;