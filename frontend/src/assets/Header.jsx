import React from "react";

const AppHeader = () => {
  return (
    <div>
    <header className="bg-primary text-white py-2 fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        <h3 className="mb-0">PDFi</h3>
        <span className="badge bg-light text-dark">Fast & Free</span>
      </div>
    
    </header>
    <div
      style = {{
        height : "50px"
      }}>
    </div>
    </div>
    
  );
};

export default AppHeader;
