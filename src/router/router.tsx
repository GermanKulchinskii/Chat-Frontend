import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "@/pages/Login/Login";
import ProtectedRoute from "@/pages/ProtectedRoute/ProtectedRoute";
import Registration from "@/pages/Registration/Registraton";
import All from "@/pages/All/All";
import Chat from "@/pages/Chat/Chat";
import CreateChat from "@/pages/CreateChat/CreateChat";

const router = createBrowserRouter([
  {
    path: 'all',
    element: (
      <ProtectedRoute>
        <All />
      </ProtectedRoute>
    ),
  },
  {
    path: 'chat/:id',
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    )
  },
  {
    path: 'create_chat',
    element: (
      <ProtectedRoute>
        <CreateChat />
      </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Registration />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
