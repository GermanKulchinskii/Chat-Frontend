import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "@/pages/Login/Login";
import ProtectedRoute from "@/pages/ProtectedRoute/ProtectedRoute";
import Registration from "@/pages/Registration/Registraton";
import All from "@/pages/All/All";
import Chat from "@/pages/Chat/Chat";
import CreateChat from "@/pages/CreateChat/CreateChat";
import Layout from "@/pages/Layout/Layout";
import NotFound from "@/pages/NotFound/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <All /> },
      { path: 'all', element: <All /> },
      { path: 'chat/:id', element: <Chat /> },
      { path: 'create_chat', element: <CreateChat /> },
    ]
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
    element: <NotFound />,
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
