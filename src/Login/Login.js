import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { connect } from "react-redux";
import { signInAPI } from "../actions";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Input = styled(TextField)({
  "& .MuiInput-input": {
    color: "white !important",
  },
  "& label": {
    color: "white !important",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#29fd53",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "white",
  },
});

const CustomButton = styled(Button)({
  color: "black",
  width: "100px",
  background: "rgb(41, 253, 83)",
  border: "1px solid rgb(41, 253, 83)",
  marginTop: "30px",
  "&:hover": {
    background: "transparent",
    color: "rgb(41, 253, 83)",
  },
});

const LoginBox = styled(Box)({
  position: "absolute",
  display: "flex",
  top: "50%",
  transform: "translateY(calc(-50% - 70px)) translateX(-50%)",
  justifyContent: "center",
  alignItems: "center",
});

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();

    const payload = {
      username: username,
      password: password,
    };

    await props.signIn(payload);
    navigate("/home");
  };

  return (
    <LoginBox
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "80vw", maxWidth: "500px" },
        display: "flex",
        flexDirection: "column",
      }}
      autoComplete="off"
      onSubmit={(e) => signIn(e)}
    >
      <h1 className="title">Login</h1>
      <div>
        <Input
          id="standard-basic"
          label="Username"
          type="text"
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <CustomButton type="submit" variant="contained">
        Login
      </CustomButton>
    </LoginBox>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signIn: (payload) => dispatch(signInAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
