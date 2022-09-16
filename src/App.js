import React from "react";
import Menu from "./Menu/Menu.js";
import Home from "./Home/Home.js";
import Login from "./Login/Login.js";
import History from "./History/History.js";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Menu />
      <Switch>
        <Route path="*" redirectTo="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
      </Switch>
    </Router>
  );
}

export default App;
