import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "./api";
import { LoginData, LoginVars } from "./AuthTypes";
import LoginForm from "../../widgets/LoginForm/LoginForm";
import cl from './Login.module.scss';

const Login: React.FC = () => {
  const [loginValue, setLoginValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const navigate = useNavigate();

  const [loginMutation, { loading, error }] = useMutation<
    LoginData,
    LoginVars
  >(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.login) {
        localStorage.setItem("accessToken", data.login.accessToken);
        localStorage.setItem("refreshToken", data.login.refreshToken);
        navigate("/");
      }
    },
    onError: (err) => {
      console.error("Ошибка входа:", err);
    },
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    try {
      await loginMutation({
        variables: { username: loginValue, password },
      });
    } catch (e) {
      console.error("Ошибка при выполнении запроса:", e);
    }
  };

  return (
    <div className={cl.bg}>
      <LoginForm
        loginValue={loginValue}
        setLoginValue={setLoginValue}
        password={password}
        setPassword={setPassword}
        validationError={validationError}
        loading={loading}
        error={error || null}
        handleLogin={handleLogin}
      />
    </div>
  );
};

export default Login;
