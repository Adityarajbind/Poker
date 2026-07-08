import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import OverlayPanel from "../components/OverlayPanel";
import API from "../api/api";
const Auth = () => {
  const { login } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [MobileisSignUp, setMobileisSignUp] = useState(false);
  const navigate = useNavigate();
  // LOGIN
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // REGISTER
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  async function HandleLogin(e) {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      login(data);
      setLoginEmail("");
      setLoginPassword("");

      navigate("/");
    } catch (error) {
      console.log("error:", error)
    }
  }

  async function HandleRegister(e) {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/register", {
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      });

      login(data);
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterUsername("");

      navigate("/");
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
    }
  }

  return (
    <>
      <div
        className=" flex justify-center items-center flex-col h-screen m-0  bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: 'url("/background1.jpg")' }}
      ></div>
      <div
        className={`overflow-hidden shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)] backdrop-blur-md bg-white/5 border-4 rounded-xl border-white/15 opacity-100 w-3xl max-[900px]:w-2xl max-[700px]:w-[320px] max-w-full min-h-120 max-[900px]:min-h-100 absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
          isSignUp ? "right-panel-active" : ""
        }`}
      >
        {/* REGISTER */}
        <RegisterForm
          isSignUp={isSignUp}
          setMobileisSignUp={setMobileisSignUp}
          MobileisSignUp={MobileisSignUp}
          username={registerUsername}
          email={registerEmail}
          password={registerPassword}
          setUsername={setRegisterUsername}
          setEmail={setRegisterEmail}
          setPassword={setRegisterPassword}
          HandleRegister={HandleRegister}
        />

        {/* LOGIN */}
        <LoginForm
          isSignUp={isSignUp}
          setMobileisSignUp={setMobileisSignUp}
          MobileisSignUp={MobileisSignUp}
          email={loginEmail}
          password={loginPassword}
          setEmail={setLoginEmail}
          setPassword={setLoginPassword}
          HandleLogin={HandleLogin}
        />

        {/* OVERLAY */}
        <OverlayPanel isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
      </div>
    </>
  );
};

export default Auth;
