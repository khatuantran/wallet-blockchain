import moment from "moment-timezone";

export const convertVND = (x: number) => {
  if (!x) {
    return null;
  }
  return x.toLocaleString("it-IT", { style: "currency", currency: "VND" }).replace("VND", "Coin");
};

export const convertTimeVN = (x: string) => {
  if (!x) {
    return null;
  }
  return moment(x).tz("Asia/Ho_Chi_Minh").format("hh:mm DD/MM/YYYY");
};
