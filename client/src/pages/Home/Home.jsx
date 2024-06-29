import React, { useState } from "react";
import CategoryPanel from "../../components/CategoryPanel";
import MinorLeftPanel from "../../components/MinorLeftPanel";
import { Outlet } from "react-router-dom";

export default function Home() {
  const [currentwindow, setCurrentWindow] = useState("");
  return (
    <div className="w-full h-screen bg-custom-black-3 flex">
      <CategoryPanel />
      <MinorLeftPanel />
      <Outlet />
    </div>
  );
}
