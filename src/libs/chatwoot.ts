import { site } from "../../config";

export const initChatwoot = () => {
    if (typeof window === "undefined") return;
    if ((window as any)._chatwootInitialized) return;
    (window as any)._chatwootInitialized = true;
    if(!site.chatwoot.enable) return;
    const BASE_URL = site.chatwoot.base_url;
    const WEBSITE_TOKEN = site.chatwoot.website_token;

    const STORAGE_EMAIL_KEY = "cw_email";
    const formatDate = (timestamp: number): string => {
      const date = new Date(timestamp);
      const pad = (num: number) => String(num).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`;
    };
  
    const getAuthorization = (): string | null => {
      return localStorage.getItem("authToken");
    };
  
    const deleteCwCookiesEverywhere = () => {
      const paths = ["/", window.location.pathname];
      const cookies = document.cookie.split(";");
  
      cookies.forEach((cookie) => {
        const [name] = cookie.split("=").map((c) => c.trim());
        if (name.startsWith("cw_")) {
          paths.forEach((path) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
          });
        }
      });
    };
  
    const getSubscribe = async () => {
      const token = getAuthorization();
      if (!token) throw new Error("未找到授权信息");
  
      const res = await fetch("/next/user/getSubscribe", {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "X-client-type": site.apiPath,
        },
      });
  
      if (!res.ok) throw new Error("获取订阅信息失败");
      return res.json();
    };
  
    const setUser = async () => {
      try {
        const { data } = await getSubscribe();
        const { email, expired_at, plan } = data;
        const previousEmail = sessionStorage.getItem(STORAGE_EMAIL_KEY);
  
        if (previousEmail !== email) {
          const description = `套餐：${plan.name}_到期时间：${formatDate(
            expired_at * 1000
          )}`;
          deleteCwCookiesEverywhere();
          sessionStorage.setItem(STORAGE_EMAIL_KEY, email);
          (window as any).$chatwoot.setUser(email, {
            name: email,
            email: email,
            description,
          });
        }
      } catch (err) {
      }
    };
    (window as any).chatwootSettings = {
      position: "left",
      type: "expanded_bubble",
      launcherTitle: "客服",
    };
    const s = document.createElement("script");
    s.src = `${BASE_URL}/packs/js/sdk.js`;
    s.async = true;
    s.defer = true;
    s.onload = () => {
      (window as any).chatwootSDK.run({
        websiteToken: WEBSITE_TOKEN,
        baseUrl: BASE_URL,
      });
      [
        "chatwoot:ready",
        "chatwoot:opened",
        "chatwoot:on-start-conversation",
        "chatwoot:on-message",
      ].forEach((event) => {
        window.addEventListener(event, setUser);
      });
    };
    document.head.appendChild(s);
  };  