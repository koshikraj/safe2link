import { Routes, Route } from 'react-router';
// import { RequireAuth, NotFound } from "../components";
import { createHashRouter,RouterProvider } from 'react-router-dom';
import HomePage from '../pages/home/Home.page';
import ClaimPage from '../pages/claim/Claim.page';
import { RoutePath } from './route-path';
import { AccountPage } from '@/pages/account/account.page';

const router = createHashRouter([
  {
    path: RoutePath.home,
    element: <HomePage />,
  },
  {
    path: RoutePath.account,
    element: <AccountPage />,
  },
  {
    path: RoutePath.claim,
    element: <ClaimPage />,
  },
]);

export function Navigation() {
  return <RouterProvider router={router} />;
}

// eslint-disable-next-line arrow-body-style
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
