import { FC } from "react";
import {} from '@/config/index'
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/app/Layout";
import { Home, NoMatch, Login, Profile, Settings, ListAccount } from "@/pages";
import { LayoutLogin } from "@/widgets";
import { WEB_ROUTER } from "@/utils/web_router";

const App: FC = () => {
  return (
    <>
      <Routes>
        <Route path={WEB_ROUTER.HOME} element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={WEB_ROUTER.SETTING} element={<Settings />} />
          <Route path={WEB_ROUTER.LIST_ACCOUNT} element={<ListAccount />} />
        </Route>
        <Route path={WEB_ROUTER.AUTH} element={<LayoutLogin />} >
          <Route path={"login"} index element={<Login />} />
          <Route path={"profile"} element={<Profile />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};

export default App;
