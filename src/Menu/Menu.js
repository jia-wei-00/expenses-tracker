import React, { useState } from "react";
import "./Menu.css";
import PaidIcon from "@mui/icons-material/Paid";
import HistoryIcon from "@mui/icons-material/History";
import { Link } from "react-router-dom";

function Menu() {
  const [active, setActive] = useState("home");

  return (
    <div className="navigation">
      <ul>
        <li
          className={active === "home" ? "list active" : "list"}
          onClick={() => setActive("home")}
        >
          <Link to="/Home">
            <span className="icon">
              <PaidIcon />
            </span>
            <span className="text">Home</span>
          </Link>
        </li>

        <li
          className={active === "settings" ? "list active" : "list"}
          onClick={() => setActive("settings")}
        >
          <Link to="/History">
            <span className="icon">
              <HistoryIcon />
            </span>
            <span className="text">History</span>
          </Link>
        </li>
        <div className="indicator"></div>
      </ul>
    </div>
  );
}

export default Menu;
