"use client";

import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Logged out successfully");
        router.push("/login"); // Redirect to login page after logout
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className="text-white bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
