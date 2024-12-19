import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MouseEvent } from "react";
import { userStore } from "@/lib/stores/user";

export default function AppNavbar() {
  const { user, setUser } = userStore();
  const logOut = (e: MouseEvent) => {
    e.preventDefault();
    setUser(undefined);
  };
  return (
    <div className="bg-neutral-950 p-3 text-gray-200">
      <nav className="text-center flex justify-between">
        <ul className="text-center flex justify-between">
          <li className="inline">
            <a href="/">
              <Button className="ml-1 hover:bg-gray-300 hover:text-black">
                Home
              </Button>
            </a>
          </li>
          {user?.data?.admin && (
            <li className="inline">
              <a href="/status">
                <Button className="ml-1 hover:bg-gray-300 hover:text-black">
                  Status
                </Button>
              </a>
            </li>
          )}
        </ul>
        {user?.data?.authKey ? (
          <>
            <ul className="text-center flex justify-normal">
              <li className="inline">
                <a href="/profile">
                  <Avatar>
                    <AvatarFallback className="bg-neutral-900">
                      {user?.data?.username?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </a>
              </li>
              <div className="m-1"></div>
              <li className="inline">
                <Button
                  type="submit"
                  onClick={logOut}
                  className="ml-1 hover:bg-gray-300 hover:text-black"
                >
                  Logout
                </Button>
              </li>
            </ul>
          </>
        ) : (
          <>
            <ul className="text-center flex justify-normal">
              <li className="inline">
                <a href="/login">
                  <Button
                    type="submit"
                    className="ml-1 hover:bg-gray-300 hover:text-black"
                  >
                    Login
                  </Button>
                </a>
              </li>
              <li className="inline">
                <a href="/register">
                  <Button
                    type="submit"
                    className="ml-1 hover:bg-gray-300 hover:text-black"
                  >
                    SignUp
                  </Button>
                </a>
              </li>
            </ul>
          </>
        )}
      </nav>
    </div>
  );
}
