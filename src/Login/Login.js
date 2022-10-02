import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { connect } from "react-redux";
import { signInAPI, resetPassword } from "../actions";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import "./Login.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
  const [resetEmail, setResetEmail] = useState("");
  const [openResetModal, setOpenResetModal] = useState(false);
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

  const register = () => {
    navigate("/register");
  };

  return (
    <>
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
        <div className="resetpassword">
          <p onClick={() => register()}>Register</p>
          <p onClick={() => setOpenResetModal(true)}>Forgot Password</p>
        </div>

        <CustomButton
          type="submit"
          variant="contained"
          disabled={props.loading}
        >
          Login
        </CustomButton>
      </LoginBox>

      {/* Confirm Delete Popup */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openResetModal}
        onClose={() => setOpenResetModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openResetModal}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Reset Password
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <TextField
                  id="standard-multiline-static"
                  label="Enter email to reset"
                  variant="standard"
                  style={{ marginBottom: "30px" }}
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
                <Button
                  onClick={() => {
                    props.reset(resetEmail);
                    setResetEmail("");
                    setOpenResetModal(false);
                  }}
                  variant="outlined"
                  color="error"
                  disabled={props.loading}
                >
                  RESET
                </Button>
              </FormControl>
            </Typography>
          </Box>
        </Fade>
      </Modal>
      {/* End Confirm Delete Popup */}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    loading: state.loadingState.loading,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signIn: (payload) => dispatch(signInAPI(payload)),
  reset: (payload) => dispatch(resetPassword(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
