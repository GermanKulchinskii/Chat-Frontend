export interface LoginFormProps {
  loginValue: string;
  setLoginValue: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  validationError: string;
  loading: boolean;
  error: { message: string } | null;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
}