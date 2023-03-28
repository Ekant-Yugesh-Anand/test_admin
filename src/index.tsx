// import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { BrowserRouter as Router } from "react-router-dom";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { CssBaseline } from "@mui/material";
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <CssBaseline />
        <App />
      </Router>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
