
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-center mb-4">404</h1>
      <p className="text-xl text-center mb-8">Page not found</p>
      <Button asChild>
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
