import "./App.css";
import authProvider from "./authProvider";

import { Authenticated, Refine, WelcomePage } from "@refinedev/core";
import { useTranslation } from "react-i18next"
import { AuthPage, Header, ThemedLayoutV2 } from "@refinedev/antd";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, { CatchAllNavigate, DocumentTitleHandler, NavigateToResource, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { supabaseClient } from "./utility";
import { FoosCreate, FoosEdit, FoosList, FoosShow } from "./pages/foos";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    (
      <BrowserRouter>
        <RefineKbarProvider>
          <Refine
            dataProvider={dataProvider(supabaseClient)}
            liveProvider={liveProvider(supabaseClient)}
            authProvider={authProvider}
            routerProvider={routerBindings}
            i18nProvider={i18nProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "72rBOh-cCAa38-slnLFB",
              liveMode: "auto"
            }}
            resources={[{
              name: "foos",
              list: "/foos",
              create: "/foos/create",
              edit: "/foos/edit/:id",
              show: "/foos/show/:id"
            }]}>
            <Routes>
              <Route index element={<WelcomePage />} />

              <Route
                element={
                  <Authenticated
                    key="authenticated-inner"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2 Header={() => <Header />}>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="/foos">
                  <Route index element={<FoosList />} />
                  <Route path="create" element={<FoosCreate />} />
                  <Route path="edit/:id" element={<FoosEdit />} />
                  <Route path="show/:id" element={<FoosShow />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                    <NavigateToResource />
                  </Authenticated>
                }>
                <Route path="/login" element={<AuthPage type="login" />} />
                <Route path="/register" element={<AuthPage type="register" />} />
                <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
                <Route path="/update-password" element={<AuthPage type="updatePassword" />} />
              </Route>

            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>          
        </RefineKbarProvider>
      </BrowserRouter >
    )
  );
}

export default App;
