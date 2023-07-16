import axios from "axios";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const BASE_API = process.env.REACT_APP_BASE_HOST;

let store = (set, get) => ({
  user: {
    fullName: "",
    email: "",
    id: "",
  },
  token: null,
  getUser: () => get().user,
  setDataUser: (data) => {
    set((state) => ({
      ...state,
      user: data,
      token: data.accessToken,
    }));
  },
  setDataUserInfor: (data) => {
    set((state) => ({
      ...state,
      user: data,
    }));
  },
  refreshDataUserInfor: async () => {
    const config = {
      method: "get",
      url: `${BASE_API}/user/profile`,
      headers: {
        Authorization: `Bearer ${get().token}`,
      },
    };
    await axios(config).then((response) => {
      set((state) => ({
        ...state,
        user: response?.data?.data,
      }));
    });
  },
  logout: async () => {
    set((state) => ({
      ...state,
      user: null,
      token: null,
    }));
  },
});

store = devtools(store) as any; // Allow redux devtool debug
store = persist(store, { name: "user" }) as any; // Persist to local storage

export default create(store);
