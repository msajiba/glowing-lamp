import { LoginForm } from "@/components/common/login-form";
import React from "react";

const loginPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
};

export default loginPage;
