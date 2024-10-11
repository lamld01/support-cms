import { FC } from "react";
import {} from '@/config/index'
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/app/Layout";
import { Home, NoMatch, Login, Settings, ListAccount, ListValidateConstrain, ListTestField, ListProject, ListTestApi, CreateTestApi, UpdateTestApi } from "@/pages";
import { LayoutLogin } from "@/widgets";
import { WEB_ROUTER } from "@/utils/web_router";

const App: FC = () => {
  return (
    <>
      <Routes>
        <Route path={WEB_ROUTER.HOME.ROOT} element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={WEB_ROUTER.SETTING.ROOT} element={<Settings />} />
          <Route path={WEB_ROUTER.LIST_ACCOUNT.ROOT} element={<ListAccount />} />
          <Route path={WEB_ROUTER.LIST_PROJECT.ROOT} element={<ListProject />} />
          <Route path={WEB_ROUTER.LIST_TEST_FIELD.ROOT} element={<ListTestField />} />
          {/* Test api router */}
          <Route path={WEB_ROUTER.LIST_TEST_API.ROOT} element={<ListTestApi />} />
          <Route path={WEB_ROUTER.LIST_TEST_API.CREATE.ROOT} element={<CreateTestApi />} />
          <Route path={WEB_ROUTER.LIST_TEST_API.UPDATE.ROOT} element={<UpdateTestApi />} />

          <Route path={WEB_ROUTER.LIST_VALIDATE_CONSTRAIN.ROOT} element={<ListValidateConstrain />} />
        </Route>
        <Route path={WEB_ROUTER.AUTH.ROOT} element={<LayoutLogin />} >
          <Route path={"login"} index element={<Login />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};

export default App;
