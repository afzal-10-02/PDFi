import React from "react";

const AppFooter = () => {
  return (
    <footer className="bg-dark text-white text-center py-1 mt-auto">
      <div className="container">
        <p className="mb-0">
          © {new Date().getFullYear()} PDFi | Built with ❤️
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
