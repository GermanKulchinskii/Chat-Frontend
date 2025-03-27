import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface RegisterFormProps {
    registerValue: string;
    setRegisterValue: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    passwordConfirm: string;
    setPasswordConfirm: React.Dispatch<React.SetStateAction<string>>;
    validationError: string;
    loading: boolean;
    error: FetchBaseQueryError | SerializedError | undefined;
    handleRegister: (e: React.FormEvent<HTMLFormElement>) => void;
  }