import React from "react";
import Menu from "./Menu/Menu.js";
import Home from "./Home/Home.js";
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
        <Route path="/History" element={<History />} />
      </Switch>
    </Router>
  );
}

export default App;
