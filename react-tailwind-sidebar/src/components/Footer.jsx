import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="text-center py-3">Mercedes Benz &copy; {currentYear}</div>
  );
};

export default Footer;
