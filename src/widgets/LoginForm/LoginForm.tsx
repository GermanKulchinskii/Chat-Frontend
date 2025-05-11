import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { LoginFormProps } from "./types";
import cl from './LoginForm.module.scss';

const LoginForm: React.FC<LoginFormProps> = ({
  loading,
  error,
  handleLogin,
}) => {
  const [loginValue, setLoginValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(loginValue, password, () => setValidationError(""));
  }, [loginValue, password, handleLogin]);

  return (
    <div className={cl.wrapper}>
      <h2 className={cl.header}>Вход</h2>
      <form onSubmit={onSubmit} autoComplete="off">
        <div className={cl.inputWrapper}>
          <label htmlFor="login" className={cl.label}>Логин:</label>
          <input
            id="login"
            type="text"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            required
            className={cl.input}
            
          />
        </div>
        <div className={cl.inputWrapper}>
          <label htmlFor="password" className={cl.label}>Пароль:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={cl.input}
          />
        </div>
        {validationError && (
          <p className={cl.validationError}>
            {validationError}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={cl.submitBtn}
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
      {error && (
        <p className={cl.submitError}>{error.message}</p>
      )}
      <div>
        <p className={cl.refWrapper}>Нет аккаунта?</p>
        <Link className={cl.regBtn} to={"/register"}>Зарегистрироваться</Link>
      </div>
    </div>
  );
};

export default React.memo(LoginForm);
