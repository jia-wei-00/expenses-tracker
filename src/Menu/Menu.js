import React, { useEffect, useState } from "react";
import "./Menu.css";
import PaidIcon from "@mui/icons-material/Paid";
import HistoryIcon from "@mui/icons-material/History";
import TopicIcon from "@mui/icons-material/Topic";
import { Link, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOutAPI } from "../actions";
import { connect } from "react-redux";
import useDetectKeyboardOpen from "use-detect-keyboard-open";

function Menu(props) {
  let location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const isKeyboardOpen = useDetectKeyboardOpen();

  useEffect(() => {
    if (
      location.pathname === "/home" ||
      location.pathname === "/memo" ||
      location.pathname === "/history"
    ) {
      setActive(location.pathname);
    } else {
      setActive("/home");
    }
  }, [location]);

  return (
    <>
      <div className="logout">
        <IconButton
          onClick={() => props.signOut()}
          color="error"
          aria-label="add to shopping cart"
        >
          <LogoutIcon />
        </IconButton>
      </div>
      {!isKeyboardOpen && (
        <div className="navigation">
          <ul>
            <li
              className={active === "/home" ? "list active" : "list"}
              // onClick={() => setActive("home")}
            >
              <Link to="/home">
                <span className="icon">
                  <PaidIcon />
                </span>
                <span className="text">Tracker</span>
              </Link>
            </li>

            <li
              className={active === "/history" ? "list active" : "list"}
              // onClick={() => setActive("settings")}
            >
              <Link to="/history">
                <span className="icon">
                  <HistoryIcon />
                </span>
                <span className="text">History</span>
              </Link>
            </li>

            <li
              className={active === "/memo" ? "list active" : "list"}
              // onClick={() => setActive("memo")}
            >
              <Link to="memo">
                <span className="icon">
                  <TopicIcon />
                </span>
                <span className="text">Todo</span>
              </Link>
            </li>
            <div className="indicator"></div>
          </ul>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOutAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
