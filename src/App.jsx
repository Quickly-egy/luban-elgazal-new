import React from "react";
import {
  BrowserRouter as Router,
  Routes,

  BrowserRouter,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";
import RoutesComponent from "./routes/RoutesComponent";

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RoutesComponent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
