import { useState, useEffect } from "react";
import { HomePage } from "./pages/HomePage";
import { UploadPage } from "./pages/UploadPage";
import "./styles/main.css";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Simple routing handler
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener("popstate", handleRouteChange);

    // Override anchor clicks for SPA navigation
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (
        anchor && 
        anchor.getAttribute("href")?.startsWith("/") && 
        !anchor.getAttribute("href")?.startsWith("//") && 
        !anchor.hasAttribute("download") && 
        !anchor.hasAttribute("rel") &&
        anchor.target !== "_blank"
      ) {
        e.preventDefault();
        const href = anchor.getAttribute("href") || "/";
        window.history.pushState({}, "", href);
        setCurrentPath(href);
      }
    });

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Render the appropriate page based on the current path
  const renderPage = () => {
    switch (currentPath) {
      case "/":
        return <HomePage />;
      case "/upload":
        return <UploadPage />;
      default:
        return <HomePage />;
    }
  };

  return <>{renderPage()}</>;
}

export default App;
