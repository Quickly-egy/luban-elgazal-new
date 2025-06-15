import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";
import RoutesComponent from "./routes/RoutesComponent";

// مكون للتمرير لأعلى عند تغيير المسار
function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <RoutesComponent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
