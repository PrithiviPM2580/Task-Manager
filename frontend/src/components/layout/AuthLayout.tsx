import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      {children}
    </div>
  );
};
export default AuthLayout;
