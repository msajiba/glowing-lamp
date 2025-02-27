"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

export default function AuthButtons() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Authentication</h1>

        <div className="flex flex-col gap-4">
          <Button
            onClick={handleSignIn}
            disabled={isAuthenticated}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>

          <Button
            onClick={handleSignOut}
            disabled={!isAuthenticated}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="mt-6 text-center text-sm">
          {isAuthenticated ? (
            <p className="text-green-500 font-medium">You are signed in</p>
          ) : (
            <p className="text-muted-foreground">You are signed out</p>
          )}
        </div>
      </div>
    </div>
  );
}
