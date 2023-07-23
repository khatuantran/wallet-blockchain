import create from "zustand";
import { devtools, persist } from "zustand/middleware";

let store = (set, get) => ({
  user: null,

  getUser: () => get().user,
  setDataUser: (data) => {
    console.log("data", data)
    set((state) => ({
      ...state,
      user: data,
    }));
  },
  setDataUserInfor: (data) => {
    set((state) => ({
      ...state,
      user: data,
    }));
  },

  logout: async () => {
    set((state) => ({
      ...state,
      user: null,
    }));
  },
});

store = devtools(store) as any; // Allow redux devtool debug
store = persist(store, { name: "user" }) as any; // Persist to local storage

export default create(store);
