import React, { JSX } from "react";
import ProtectedRoute from "../../shared/ProtectedRoute";

const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <div className="max-w-8xl mx-auto">
      <ProtectedRoute>{children}</ProtectedRoute>
    </div>
  );
};

export default Layout;
