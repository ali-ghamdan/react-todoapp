import { create } from "zustand";
import User from "../classes/User";
const key = "user_token";

const token = localStorage.getItem(key);
const usr = token ? new User() : undefined;
await usr?.fetch(token!);

export const userStore = create<{
  user: User | undefined;
  setUser: (accessToken: string | undefined) => Promise<User | undefined>;
}>((set) => ({
  user: usr,
  setUser: (accessToken) => {
    if (!accessToken) {
      localStorage.removeItem(key);
      set({ user: undefined });
      return Promise.resolve(undefined);
    } else {
      localStorage.setItem(key, accessToken);
      const user = new User();
      set({ user });
      return user.fetch(accessToken);
    }
  },
}));
