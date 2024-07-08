import React, { useState } from "react";
import CategoryPanel from "../../components/CategoryPanel";
import MinorLeftPanel from "../../components/MinorLeftPanel";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full h-screen bg-custom-black-3 flex">
      <CategoryPanel />
      <MinorLeftPanel />
      <div className="w-[67vw] h-full">
        <Outlet />
      </div>
    </div>
  );
}
