import React, { useEffect } from "react";
import Menu from "./Menu/Menu.js";
import Home from "./Home/Home.js";
import Login from "./Login/Login.js";
import History from "./History/History.js";
import LoginPage from "./Login/Login.js";
import Memo from "./Memo/Memo.js";
import { getUserAuth } from "./actions";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";

function App(props) {
  useEffect(() => {
    props.getUserAuth();
  }, []);

  return (
    <Router>
      {!props.user ? (
        <>
          <Switch>
            <Route path="*" redirectTo="/" element={<Login />} />
          </Switch>
        </>
      ) : (
        <>
          <Menu />
          <Switch>
            <Route path="*" redirectTo="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/memo" element={<Memo />} />
          </Switch>
        </>
      )}
    </Router>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
