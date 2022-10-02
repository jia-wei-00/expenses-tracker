import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { connect } from "react-redux";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../actions";
import Reaptcha from "reaptcha";
import "./Register.css";

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

const Register = (props) => {
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState(null);

  const REACT_APP_SECRET_KEY = "6LfnDUsiAAAAAKcxh6NYZnWJlN6VAPKdOcnM2k4y";
  const REACT_APP_SITE_KEY = "6LfnDUsiAAAAAEeIE3eqhQMgq2-oF6iBRGup4uNM";

  const form = useRef();
  const captchaRef = useRef(null);

  const verify = () => {
    captchaRef.current.getResponse().then((res) => {
      setCaptchaToken(res);
      console.log(captchaToken);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const id = toast.loading("Please wait...");
    props.setLoading(true);

    await emailjs
      .sendForm(
        "service_altpp9t",
        "template_md4laxs",
        form.current,
        "uLGAa7lNHpoKmGu0q"
      )
      .then(
        (result) => {
          props.setLoading(false);
          toast.update(id, {
            render: "Success",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          console.log(result.text);
        },
        (error) => {
          props.setLoading(false);
          toast.update(id, {
            render: error.text,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });

          console.log(error.text);
        }
      );

    captchaRef.current.reset();
    form.current.reset();
  };

  const login = () => {
    navigate("/");
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
        ref={form}
        onSubmit={(e) => onSubmit(e)}
      >
        <h1 className="title">Register</h1>
        <h4 className="text">
          Hi, my name is Leong Jia Wei. This is my personal project, if you wish
          to use it you may submit the form below or contact me to register an
          account.
        </h4>
        <h4 className="text">
          Here is my portfolio
          <a href="https://jia-wei-portfolio.vercel.app/" target="_blank">
            Link
          </a>
        </h4>
        <div>
          <Input
            id="standard-basic"
            label="Name"
            name="name"
            type="text"
            variant="standard"
            required
          />
        </div>
        <div>
          <Input
            id="standard-basic"
            label="Email"
            name="email"
            type="email"
            variant="standard"
            required
          />
        </div>
        <div className="login__btn">
          <p onClick={() => login()}>Login</p>
        </div>
        <Reaptcha
          sitekey={REACT_APP_SITE_KEY}
          ref={captchaRef}
          onVerify={verify}
        />
        <CustomButton type="submit" variant="contained">
          Submit
        </CustomButton>
      </LoginBox>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loadingState.loading,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setLoading: (payload) => dispatch(setLoading(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
