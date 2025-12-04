import React from "react";
import picture from "../assets/picture.png"; 
import Navbar from "../components/Navbar/Navbar"; // Importe a Navbar nova

const Home = () => {
  return (
    <div className="prototype-container">
      {/* Imagem do Protótipo no Centro */}
      <img src={picture} alt="Protótipo Home" className="prototype-image" />
      
      {/* Navbar Flutuante por cima de tudo */}
      <Navbar />
    </div>
  );
};

export default Home;