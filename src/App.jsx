import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import { messageAPI } from "./services/endpoints";
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
