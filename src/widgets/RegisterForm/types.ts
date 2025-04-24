import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Dispatch, SetStateAction } from "react";

export interface RegisterFormProps {
    setValidationError: Dispatch<SetStateAction<string>>;
    validationError: string;
    loading: boolean;
    error: FetchBaseQueryError | SerializedError | undefined;
    handleRegister: (username: string, password: string, confirmPassword: string) => Promise<void>;
  }