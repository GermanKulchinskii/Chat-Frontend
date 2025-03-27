import React from "react";
import { Link } from "react-router-dom";
import { RegisterFormProps } from "./types";
import cl from './RegisterForm.module.scss';

const RegisterForm: React.FC<RegisterFormProps> = ({
  registerValue,
  setRegisterValue,
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm,
  validationError,
  loading,
  error,
  handleRegister,
}) => {
  return (
    <div className={cl.wrapper}>
      <h2 className={cl.header}>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <div className={cl.inputWrapper}>
          <label htmlFor="login" className={cl.label}>Логин:</label>
          <input
            id="login"
            type="text"
            value={registerValue}
            onChange={(e) => setRegisterValue(e.target.value)}
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
        <div className={cl.inputWrapper}>
          <label htmlFor="password-confirm" className={cl.label}>Повторите пароль:</label>
          <input
            id="password-confirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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
          {loading ? "Регистрация..." : "Регистрация"}
        </button>
      </form>
      {error && (
        <p className={cl.submitError}>Произошла ошибка. Попробуйте позже</p>
      )}
      <div>
        <p className={cl.refWrapper}>Есть аккаунт?</p>
        <Link className={cl.regBtn} to={"/login"}>Войти</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
