import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { hasValidOrgSession } from "../../api/auth";

export default function Layout() {
  // Real guard: a present, unexpired organization JWT. The server verifies it
  // on every request too — this just avoids rendering the dashboard shell for
  // an unauthenticated visitor.
  if (!hasValidOrgSession()) {
    return <Navigate to="/organization" replace />;
  }

  return (
    <div className="flex flex-row bg-black h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
