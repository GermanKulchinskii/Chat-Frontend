import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "@/store/store";
import { authActions } from "@/store/Auth";
import { useRefreshAccessTokenMutation } from "@/services/authApi";
import { useSelector } from "react-redux";
import { isAuthenticated as isAuth } from "@/store/Auth/selector";
import Loader from "@/shared/Loader/Loader";
import { Box } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(isAuth);
  const dispatch = useAppDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [refreshTokenTrigger] = useRefreshAccessTokenMutation();

  useEffect(() => {
    const checkAuth = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      
      if (!isAuthenticated && storedRefreshToken) {
        try {
          const result = await refreshTokenTrigger({ 
            refreshToken: storedRefreshToken 
          }).unwrap();
          
          const newAccessToken = result.data.refreshAccessToken.value;
          
          localStorage.setItem("accessToken", newAccessToken);
          
          dispatch(
            authActions.loginSuccess({
              accessToken: newAccessToken,
              refreshToken: storedRefreshToken,
            })
          );
        } catch (err) {
          console.error("Ошибка обновления токена:", err);
          dispatch(authActions.logout());
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [dispatch, refreshTokenTrigger, isAuthenticated]);

  if (isCheckingAuth) {
    return ( 
      <Box 
        width={"100%"}
        height={"100vh"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        bgcolor={"#252525"}
      >
        <Loader />
      </Box>
  );
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;