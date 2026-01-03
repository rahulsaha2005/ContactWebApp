import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./shared/navbar.jsx";

function MainLayout() {
  return (
    <div>
      <Navbar />
      <Outlet /> 
    </div>
  );
}

export default MainLayout;
