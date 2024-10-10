import { FC } from "react";
import {} from '@/config/index'
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/app/Layout";
import { Home, NoMatch, Login, Settings, ListAccount, ListApiField, ListValidateConstrain } from "@/pages";
import { LayoutLogin } from "@/widgets";
import { WEB_ROUTER } from "@/utils/web_router";
import { ListProject } from "@/pages/Project";

const App: FC = () => {
  return (
    <>
      <Routes>
        <Route path={WEB_ROUTER.HOME} element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={WEB_ROUTER.SETTING} element={<Settings />} />
          <Route path={WEB_ROUTER.LIST_ACCOUNT} element={<ListAccount />} />
          <Route path={WEB_ROUTER.LIST_PROJECT} element={<ListProject />} />
          <Route path={WEB_ROUTER.LIST_TEST_FIELD} element={<ListApiField />} />
          <Route path={WEB_ROUTER.LIST_VALIDATE_CONSTRAIN} element={<ListValidateConstrain />} />
        </Route>
        <Route path={WEB_ROUTER.AUTH} element={<LayoutLogin />} >
          <Route path={"login"} index element={<Login />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};

export default App;
