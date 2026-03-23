import React from "react";
import PageLayout from "../components/PageLayout/PageLayout";

const Contributions = () => {
  const contributionsData = [
    { id: 1, title: "Lixo Acumulado", date: "15/10/2023", status: "Em análise" },
    { id: 2, title: "Água parada", date: "12/10/2023", status: "Validado" },
    { id: 3, title: "Buraco na via", date: "08/10/2023", status: "Resolvido" },
    { id: 4, title: "Vazamento de água", date: "12/10/2023", status: "Validado" },
  ];


  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "20px 5%", 
    gap: "15px",
    flex: 1,
    overflowY: "auto", 
    boxSizing: "border-box",
  };

  const itemCardStyle = {
    backgroundColor: "#F0F0F0", 
    borderRadius: "10px",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  };

  const itemContentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1 
  };

  const itemTitleStyle = {
    fontWeight: "bold",
    color: "#2D4627", 
    fontSize: "16px",
    margin: 0
  };

  const itemDateStyle = {
    color: "#757575", 
    fontSize: "12px",
    margin: 0
  };

  const statusBadgeStyleBase = {
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
    textAlign: "center",
    whiteSpace: "nowrap", 
  };

  const statusColors = {
    "Em análise": "#D6A352", 
    "Validado": "#78A64B",    
    "Resolvido": "#3D82D6"  
  };

  const getStatusStyle = (status) => {
    const backgroundColor = statusColors[status] || "#757575";
    return { ...statusBadgeStyleBase, backgroundColor };
  };

  return (
    <PageLayout title="Contribuições">
      <div style={containerStyle}>
        
        {contributionsData.map((contribution) => (
          <div key={contribution.id} style={itemCardStyle}>
            
            <div style={itemContentStyle}>
              <p style={itemTitleStyle}>{contribution.title}</p>
              <p style={itemDateStyle}>{contribution.date}</p>
            </div>

            <div style={getStatusStyle(contribution.status)}>
              {contribution.status}
            </div>

          </div>
        ))}

      </div>
    </PageLayout>
  );
};

export default Contributions;