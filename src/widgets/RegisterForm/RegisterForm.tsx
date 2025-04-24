import React, { FormEvent, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { RegisterFormProps } from "./types";
import cl from './RegisterForm.module.scss';

const RegisterForm: React.FC<RegisterFormProps> = ({
  setValidationError,
  validationError,
  loading,
  error,
  handleRegister,
}) => {
  const [registerValue, setRegisterValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      handleRegister(registerValue, password, passwordConfirm);
    } catch (err: any) {
      setValidationError("Ошибка регистрации: " + (err.message || "Попробуйте позже"));
    }
  }, [handleRegister, setValidationError, registerValue, password, passwordConfirm]);
  
  return (
    <div className={cl.wrapper}>
      <h2 className={cl.header}>Регистрация</h2>
      <form onSubmit={onSubmit}>
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

export default React.memo(RegisterForm);
