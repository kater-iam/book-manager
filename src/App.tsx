import "./App.css";
import authProvider from "./authProvider";

import { Authenticated, Refine, I18nProvider } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { AuthPage, ThemedLayoutV2 } from "@refinedev/antd";
import { useTranslation } from "react-i18next";
import routerBindings, { CatchAllNavigate, DocumentTitleHandler, NavigateToResource, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { supabaseClient } from "./utility";
import { Title } from "./components/title";
import { BooksCreate, BooksEdit, BooksList, BooksShow } from "./pages/books";
import { LendingsCreate, LendingsEdit, LendingsList, LendingsShow } from "./pages/lendings";
import { Header } from "./components/header";

function App() {
  const { t, i18n } = useTranslation();
  const i18nProvider: I18nProvider = {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore 
    translate: (key: any, options?: any) => {
      // console.log(key, options)
      return t(key, options)
    },
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    (<BrowserRouter>
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
            projectId: "45VCnM-1kez3C-I7s8dD",
            liveMode: "auto",
          }}
          resources={[{
            name: "books",
            list: "/books",
            create: "/books/create",
            edit: "/books/edit/:id",
            show: "/books/show/:id",
          }, {
            name: "lendings",
            list: "/lendings",
            create: "/lendings/create",
            edit: "/lendings/edit/:id",
            show: "/lendings/show/:id"
          }]}>
          <Routes>

            <Route
              element={
                <Authenticated
                  key="authenticated-inner"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <ThemedLayoutV2
                    Header={() => <Header />}
                    Title={({ collapsed }) => <Title collapsed={collapsed} />}
                  >
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              <Route path="/books">
                <Route index element={<BooksList />} />
                <Route path="create" element={<BooksCreate />} />
                <Route path="edit/:id" element={<BooksEdit />} />
                <Route path="show/:id" element={<BooksShow />} />
              </Route>
              <Route path="/lendings">
                <Route index element={<LendingsList />} />
                <Route path="create" element={<LendingsCreate />} />
                <Route path="edit/:id" element={<LendingsEdit />} />
                <Route path="show/:id" element={<LendingsShow />} />
              </Route>

            </Route>

            <Route
              element={
                <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                  <NavigateToResource />
                </Authenticated>
              }>

              <Route path="/" element={<AuthPage type="login" title={<Title />} />} />
              <Route path="/login" element={<Navigate replace to="/" />} />
              <Route path="/register" element={<AuthPage type="register" title={<Title />} />} />
              <Route path="/forgot-password" element={<AuthPage type="forgotPassword" title={<Title />} />} />
              <Route path="/update-password" element={<AuthPage type="updatePassword" title={<Title />} />} />
            </Route>

          </Routes>
          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>)
  );
}

export default App;
