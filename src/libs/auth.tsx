import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SWRConfig } from "swr";
import { fetch, fetcher } from "./request";

interface RemoteConfig {
  tos_url: string | null;
  is_email_verify: number;
  is_invite_force: number;
  email_whitelist_suffix: string[];
  is_recaptcha: number;
  recaptcha_site_key: string;
  app_description: string;
  app_url: string;
  logo: string;
  app_name: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthChecked: boolean;
  remoteConfig: RemoteConfig; // 不再允许 null
  userInfo: UserInfo | null;
  appConfig: AppConfig | null;
  loadUserInfo: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<AuthResponse<LoginResponse>>;
  register: (
    email: string,
    password: string,
    email_code: string,
    code: string,
    invite_code: string,
  ) => Promise<AuthResponse<LoginResponse>>;
  token2Login: (token: string) => Promise<AuthResponse<LoginResponse>>;
  reset: (
    email: string,
    password: string,
    email_code: string
  ) => Promise<AuthResponse<boolean>>;
  changePass: (
    oldPass: string,
    newPass: string
  ) => Promise<AuthResponse<boolean>>;
  sendEmailVerify: (
    email: string,
    code?: string | null
  ) => Promise<AuthResponse<boolean>>;
  logout: () => Promise<void>;
}

const defaultRemoteConfig: RemoteConfig = {
  tos_url: null,
  is_email_verify: 0,
  is_invite_force: 0,
  email_whitelist_suffix: [],
  is_recaptcha: 0,
  recaptcha_site_key: "",
  app_description: "",
  app_url: "",
  logo: "",
  app_name: "",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [remoteConfig, setRemoteConfig] = useState<RemoteConfig>(defaultRemoteConfig);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    if (isAuthChecked) return;
    loadRemoteConfig();
    const token = localStorage.getItem("authToken");
    if (token) {
      checkSession(token);
    } else {
      setIsAuthChecked(true);
    }
  }, [isAuthChecked]);

  const loadRemoteConfig = async () => {
    if (
      remoteConfig &&
      JSON.stringify(remoteConfig) !== JSON.stringify(defaultRemoteConfig)
    )
      return;
    try {
      const { data, status } = await fetch.get("guest/comm/config");
      if (status === 200 && data.data) setRemoteConfig(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkSession = async (token: string) => {
    try {
      await loadSession(false, token);
      await fetch.get("user/checkLogin");
      await loadSession(true, token);
    } catch {
      await loadSession(false, null);
    } finally {
      setIsAuthChecked(true);
    }
  };

  const loadSession = async (isTrue: boolean, token: string | null) => {
    try {
      if (token) {
        fetch.defaults.headers.common["Authorization"] = token;
        localStorage.setItem("authToken", token);
      } else {
        delete fetch.defaults.headers.common["Authorization"];
        localStorage.removeItem("authToken");
      }

      setIsLoggedIn(isTrue);
      if (isTrue) {
        await loadUserInfo();
        await loadAppConfig();
      } else {
        setUserInfo(null);
        setAppConfig(null);
      }
    } catch (error) {
      await logout();
      console.log(error);
    }
  };

  const loadUserInfo = async () => {
    try {
      const { data, status } = await fetch.get("user/info");
      if (status === 200) {
        setUserInfo(data.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const loadAppConfig = async () => {
    try {
      const { data, status } = await fetch.get("user/comm/config");
      if (status === 200) {
        setAppConfig(data.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await loadSession(false, null);
  };

  const login = async (email: string, password: string) => {
    try {
      const { data }: { data: AuthResponse<LoginResponse> } = await fetch.post(
        "passport/auth/login",
        {
          email,
          password,
        }
      );
      loadSession(true, data.data.auth_data);
      return data;
    } catch (e) {
      throw e;
    }
  };

  const register = async (
    email: string,
    password: string,
    email_code: string,
    code: string,
    invite_code: string,
  ) => {
    try {
      const { data }: { data: AuthResponse<LoginResponse> } = await fetch.post(
        "passport/redeem/register",
        {
          email,
          email_code,
          password,
          code,
          invite_code,
        }
      );
      loadSession(true, data.data.auth_data);
      return data;
    } catch (e) {
      throw e;
    }
  };

  const token2Login = async (token: string) => {
    try {
      const { data }: { data: AuthResponse<LoginResponse> } = await fetch.get(
        "/passport/auth/token2Login?verify=" + token
      );
      loadSession(true, data.data.auth_data);

      return data;
    } catch (e) {
      throw e;
    }
  };

  const reset = async (email: string, password: string, email_code: string) => {
    try {
      const { data } = await fetch.post("passport/auth/forget", {
        email,
        password,
        email_code,
      });
      return data;
    } catch (e) {
      throw e;
    }
  };

  const sendEmailVerify = async (
    email: string,
    recaptcha_data?: string | null
  ) => {
    try {
      const { data } = await fetch.post("passport/comm/sendEmailVerify", {
        email,
        recaptcha_data,
      });
      return data;
    } catch (e) {
      throw e;
    }
  };

  const changePass = async (oldPass: string, newPass: string) => {
    try {
      const { data } = await fetch.post("user/changePassword", {
        old_password: oldPass,
        new_password: newPass,
      });
      await logout();
      return data;
    } catch (e) {
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthChecked,
        isLoggedIn,
        remoteConfig,
        userInfo,
        appConfig,
        login,
        logout,
        register,
        token2Login,
        reset,
        changePass,
        sendEmailVerify,
        loadUserInfo,
      }}
    >
      <SWRConfig
        value={{
          fetcher,
          errorRetryCount: 1,
          errorRetryInterval: 100,
        }}
      >
        {children}
      </SWRConfig>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
