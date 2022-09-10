import React, { useState } from "react";
import "./Menu.css";
import PaidIcon from "@mui/icons-material/Paid";
import HistoryIcon from "@mui/icons-material/History";

function Menu() {
  const [active, setActive] = useState("home");

  return (
    <div className="navigation">
      <ul>
        <li
          className={active === "home" ? "list active" : "list"}
          onClick={() => setActive("home")}
        >
          <a href="#">
            <span className="icon">
              <PaidIcon />
            </span>
            <span className="text">Home</span>
          </a>
        </li>

        <li
          className={active === "settings" ? "list active" : "list"}
          onClick={() => setActive("settings")}
        >
          <a href="#">
            <span className="icon">
              <HistoryIcon />
            </span>
            <span className="text">History</span>
          </a>
        </li>
        <div className="indicator"></div>
      </ul>
    </div>
  );
}

export default Menu;
