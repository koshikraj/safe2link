import { Routes, Route } from "react-router";
// import { RequireAuth, NotFound } from "../components";
import HomePage  from '../pages/Home.page';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RoutePath } from "./route-path";


const router = createBrowserRouter([
  {
    path: RoutePath.home,
    element: <HomePage />,
  },
  {
    path: RoutePath.account,
    element: <HomePage />,
  },
  {
    path: RoutePath.claim,
    element: <HomePage />,
  },
]);

export function Navigation() {
  return <RouterProvider router={router} />;
}



export const LandingPageNavigation = () => {
  return (
    <>
      {/* <GlobalStyle /> */}
      <Routes>
        <Route path={RoutePath.home} element={<HomePage />} />
      </Routes>
    </>
  );
};


