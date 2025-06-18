import { encode } from "js-base64";
export const checkPeriod = (item: PlanData) => {
  if (item.month_price) return "month_price";
  if (item.quarter_price) return "quarter_price";
  if (item.half_year_price) return "half_year_price";
  if (item.year_price) return "year_price";
  if (item.two_year_price) return "two_year_price";
  if (item.three_year_price) return "three_year_price";
  if (item.onetime_price) return "onetime_price";
  return "reset_price";
};
export const lowestPrice = (item: PlanData) => {
  const plan = checkPeriod(item);
  return (item[plan] ?? 0) / 100;
};
export const app2scheme = (appName: string, subUrl: string, title?: string) => {
  switch (appName) {
    case "clash":
      return `clash://install-config?url=${encodeURIComponent(
        subUrl
      )}&name=${title}`;
    case "surge":
      return `surge:///install-config?url=${encodeURIComponent(
        subUrl
      )}&name=${title}`;
    case "loon":
      return `loon://import?sub=${encodeURIComponent(subUrl)}&name=${title}`;
    case "quanx":
      return `quantumult-x:///add-resource?remote-resource=${encodeURI(
        JSON.stringify({ server_remote: [`${subUrl}, tag=${title}`] })
      )}`;
    case "shadowrocket":
      return `shadowrocket://add/sub://${encode(
        subUrl + "&flag=shadowrocket"
      )}?remark=${title}`;
    case "sing-box":
      return `sing-box://import-remote-profile?url=${encodeURIComponent(
        subUrl
      )}#${title}`;
  }
  return "";
};