export interface LoginFormProps {
  loading: boolean;
  error: { message: string } | null;
  handleLogin: (loginValue: string, password: string, resetValidation: () => void) => void;
}