import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Profile from "./components/Profile.jsx";
function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },
        { path: "/profile", element: <Profile /> },
      ],
    },
  ]);

  return <RouterProvider router={appRouter} />;
}

export default App;
