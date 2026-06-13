import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { hasValidOrgSession } from "../../api/auth";

export default function Layout() {
  // Real guard: a present, unexpired organization JWT. The server verifies it
  // on every request too — this just avoids rendering the dashboard shell for
  // an unauthenticated visitor.
  if (!hasValidOrgSession()) {
    return <Navigate to="/organization" replace />;
  }

  return (
    <div className="min-h-dvh bg-black text-white flex flex-col">
      <TopNav />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto w-full px-5 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
