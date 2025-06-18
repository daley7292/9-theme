import axios from "axios";
import { toast } from "./toastHandler";

const errorHandle = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      const error = err.response?.data;
      return toast.error(
        Array.isArray(error?.data) ? error?.data[0] : error?.data
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return toast.error("网络错误，请尝试更换浏览器或者网络环境后再试");
    }
  }
  return toast.error(err instanceof Error ? err.message : "未知错误");
};

export default errorHandle;
