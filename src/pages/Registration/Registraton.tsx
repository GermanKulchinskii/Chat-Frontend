import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../widgets/RegisterForm/RegisterForm";
import cl from './Registration.module.scss';
import { useRegisterMutation } from "@/services/authApi";
import { useAppDispatch } from "@/store/store";
import { authActions } from "@/store/Auth";

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [validationError, setValidationError] = useState<string>("");

  const [register, { error, isLoading }] = useRegisterMutation();

  const handleRegister = useCallback(
    async (username: string, password: string, confirmPassword: string) => {
      setValidationError("");

      if (username.length < 2) {
        throw new Error("Логин должен содержать не менее 2 символов");
      }
      if (password.length < 6) {
        throw new Error("Пароль должен содержать не менее 6 символов");
      }
      if (!/^[A-Za-z]+$/.test(password)) {
        throw new Error("Пароль должен состоять только из латинских букв");
      }
      if (password !== confirmPassword) {
        throw new Error("Пароли не совпадают");
      }

      const result = await register({ username, password }).unwrap();
      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }

      const { accessToken, refreshToken } = result.data.register;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      dispatch(authActions.loginSuccess({ accessToken, refreshToken, username }));
      navigate("/");
    },
    [register, dispatch, navigate]
  );

  return (
    <div className={cl.bg}>
      <RegisterForm 
        setValidationError={setValidationError}
        validationError={validationError}
        loading={isLoading}
        error={error}
        handleRegister={handleRegister}
      />
    </div>
  );
};

export default Registration;
