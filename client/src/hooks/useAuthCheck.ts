import { useEffect, useState } from "react";

export function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar se há cookie de sessão
    const hasCookie = document.cookie.includes("session_token");
    setIsAuthenticated(hasCookie);
  }, []);

  return isAuthenticated;
}
