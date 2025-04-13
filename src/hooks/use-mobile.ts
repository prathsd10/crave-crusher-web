
import * as React from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Listen for resize events
    window.addEventListener("resize", checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
}
