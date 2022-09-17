import React, { useState, useEffect } from "react";
import "./Menu.css";
import PaidIcon from "@mui/icons-material/Paid";
import HistoryIcon from "@mui/icons-material/History";
import TopicIcon from "@mui/icons-material/Topic";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOutAPI } from "../actions";
import { connect } from "react-redux";

function Menu(props) {
  const [active, setActive] = useState("home");
  const [show, setShow] = useState(true);
  const [height, setHeight] = useState();

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);

      if (height < 600) {
        setShow(false);
      } else if (height >= 600) {
        setShow(true);
      }
    };

    window.addEventListener("resize", handleResize);
  }, [window.innerHeight]);

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
      {show && (
        <div className="navigation">
          <ul>
            <li
              className={active === "home" ? "list active" : "list"}
              onClick={() => setActive("home")}
            >
              <Link to="/home">
                <span className="icon">
                  <PaidIcon />
                </span>
                <span className="text">Tracker</span>
              </Link>
            </li>

            <li
              className={active === "settings" ? "list active" : "list"}
              onClick={() => setActive("settings")}
            >
              <Link to="/history">
                <span className="icon">
                  <HistoryIcon />
                </span>
                <span className="text">History</span>
              </Link>
            </li>

            <li
              className={active === "todo" ? "list active" : "list"}
              onClick={() => setActive("todo")}
            >
              <Link to="login">
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
