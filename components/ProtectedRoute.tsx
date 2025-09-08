import React from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  
  // Check if we're on client side
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  const token = localStorage.getItem("user_token");
  const userData = localStorage.getItem("user_data");
  const role = userData ? JSON.parse(userData).role : null;

  if (!token) {
    router.push("/admin");
    return null;
  }

  if (role && !allowedRoles.includes(role)) {
    router.push("/forbidden");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
