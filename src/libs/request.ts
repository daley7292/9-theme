import { site } from "../../config";
import axios, { AxiosError } from "axios";

export const fetch = axios.create({
  baseURL: "/" + site.apiPath,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Type": site.clientMark,
  },
});

export const fetcher = async (url: string) => {
  try {
    const data = await fetch.get(url);
    return data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const data = (e as AxiosError<ErrorResponse>).response?.data;
      throw new Error(Array.isArray(data?.data) ? data?.data[0] : data?.data);
    } else {
      throw e;
    }
  }
};
