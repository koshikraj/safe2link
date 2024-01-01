// import { RequireAuth, NotFound } from "../components";
import { createHashRouter,RouterProvider, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/Home.page';
import ClaimPage from '../pages/claim/Claim.page';
import { RoutePath } from './route-path';
import { AccountPage } from '@/pages/account/account.page';


export const Navigation = () => {
  return (
    <Routes>
      <Route path={RoutePath.home} element={<HomePage />} />
      <Route path={RoutePath.claim} element={<ClaimPage />} />
      <Route path={RoutePath.account} element={<AccountPage />} />
    </Routes>
  );
};

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
