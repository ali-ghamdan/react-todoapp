import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import AppTodoList from "./components/AppTodoList";
import AppNotFound from "./components/AppNotFound";
import AppLogin from "./components/AppLogin";
import AppRegister from "./components/AppRegister";
import AppUnauthorized from "./components/AppUnauthorized";
import { userStore } from "./lib/stores/user";

function App() {
  const user = userStore((state) => state.user);

  return (
    <div className="">
      <div>
        <AppNavbar />
        <div className="text-center m-5">
          {user?.data?.authKey ? (
            <>
              <div className="flex justify-center">
                <BrowserRouter>
                  <Routes>
                    <Route path="/" Component={AppTodoList} />
                    <Route path="*" Component={AppNotFound} />
                  </Routes>
                </BrowserRouter>
              </div>
            </>
          ) : (
            <>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" Component={AppLogin} />
                  <Route path="/register" Component={AppRegister} />
                  <Route path="*" Component={AppUnauthorized} />
                </Routes>
              </BrowserRouter>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
