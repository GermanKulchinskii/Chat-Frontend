import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../widgets/RegisterForm/RegisterForm";
import cl from './Registration.module.scss';
import { useRegisterMutation } from "@/services/authApi";
import { useAppDispatch } from "@/store/store";
import { authActions } from "@/store/Auth";

const Registration: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [register, { data, error, isLoading }] = useRegisterMutation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (username.length < 2) {
      setValidationError("Логин должен содержать не менее 2 символов");
      return;
    }

    if (password.length < 6) {
      setValidationError("Пароль должен содержать не менее 6 символов");
      return;
    }

    if (!/^[A-Za-z]+$/.test(password)) {
      setValidationError("Пароль должен состоять только из латинских букв");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Пароли не совпадают");
      return;
    }

    register({ username, password })
    .unwrap()
    .then((result) => {
      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }

      const { accessToken, refreshToken } = result.data.register;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      dispatch(authActions.loginSuccess({ accessToken, refreshToken }));
      
      navigate("/");
    })
    .catch((err) => {
      setValidationError("Ошибка регистрации: " + (err.message || "Попробуйте позже"));
    });
  };

  return (
    <div className={cl.bg}>
      <RegisterForm 
        registerValue={username}
        setRegisterValue={setUsername}
        password={password}
        setPassword={setPassword}
        passwordConfirm={confirmPassword}
        setPasswordConfirm={setConfirmPassword}
        validationError={validationError}
        loading={isLoading}
        error={error}
        handleRegister={handleRegister}
      />
    </div>
  );
};

export default Registration;
