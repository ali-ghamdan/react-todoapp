import { FormEvent } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { inputsStyle } from "@/lib/constants";
import { Button } from "./ui/button";
import { userStore } from "@/lib/stores/user";
import User from "@/lib/classes/User";

export default function AppRegister() {
  const { setUser } = userStore();
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [username, email, password] = [
      (document.getElementById("username") as HTMLInputElement)?.value,
      (document.getElementById("email") as HTMLInputElement)?.value,
      (document.getElementById("password") as HTMLInputElement)?.value,
    ];
    let usr: User | undefined = new User();
    await usr.create({ email, password, username });
    usr = await setUser(usr.data?.authKey).catch((e) => {
      console.error(e);
      return undefined;
    });
    if (!usr) {
      alert("SignUp Failed, try again with another email.");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <>
      <center>
        <div className="bg-zinc-950 max-w-prose p-4 rounded-lg">
          <div className="flex">
            <form onSubmit={handleRegister} className="w-full">
              <div className="w-11/12">
                <div>
                  <div className="flex ml-1 mb-1 mt-2">
                    <Label>
                      <sub>Username</sub>
                    </Label>
                  </div>
                  <Input
                    className={`${inputsStyle} border-b-zinc-800 border-l-2 border-l-zinc-800 rounded-sm`}
                    type="text"
                    id="username"
                  />
                </div>
                <div>
                  <div className="flex ml-1 mb-1 mt-2">
                    <Label>
                      <sub>Email</sub>
                    </Label>
                  </div>
                  <Input
                    className={`${inputsStyle} border-b-zinc-800 border-l-2 border-l-zinc-800 rounded-sm`}
                    type="email"
                    id="email"
                  />
                </div>
                <div>
                  <div className="flex ml-1 mb-1 mt-2">
                    <Label>
                      <sub>Password</sub>
                    </Label>
                  </div>
                  <Input
                    className={`${inputsStyle} border-b-zinc-800 border-l-2 border-l-zinc-800 rounded-sm`}
                    type="password"
                    id="password"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-end my-2 translate-y-4 translate-x-2">
                  <Button type="submit">SignUp</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </center>
    </>
  );
}
