import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";

import ContextProvider from "@/context/ContextProvider";
import BaseLayout from "@/components/BaseLayout";
import Home from "@/pages/Home";
import Cats from "@/pages/Cats";
import Dogs from "@/pages/Dogs";
import TodoList from "@/pages/TodoList";
import PageNotFound from "@/pages/PageNotFound";

const routes = [
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cats",
        element: <Cats />,
      },
      {
        path: "/dogs",
        element: <Dogs />,
      },
      {
        path: "/todo-list",
        element: <TodoList />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
];

const AppRoutes = () => {
  return (
    <ContextProvider>
      <RouterProvider router={createBrowserRouter(routes)} />

      <ToastContainer />
    </ContextProvider>
  );
};

export default AppRoutes;
