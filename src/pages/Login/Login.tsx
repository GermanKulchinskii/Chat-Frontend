import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "./api";
import { LoginData, LoginVars } from "./AuthTypes";
import LoginForm from "../../widgets/LoginForm/LoginForm";
import cl from './Login.module.scss';

const Login: React.FC = () => {
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

  const handleLogin = useCallback(
    (loginValue: string, password: string, resetValidation: () => void) => {
      resetValidation();
      loginMutation({
        variables: { username: loginValue, password },
      });
    }, 
    [loginMutation]
  );

  return (
    <div className={cl.bg}>
      <LoginForm
        loading={loading}
        error={error || null}
        handleLogin={handleLogin}
      />
    </div>
  );
};

export default Login;
