import { site } from "../../../../config";
import axios, { AxiosError } from "axios";
import { Params } from "next/dist/server/request/params";

// create axios instance
const baseURL = new URL("api/v1", site.api).toString();
const request = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});
// request interceptor
const hasXMark = (req: Request) => {
  const xClientType = req.headers.get("X-Client-Type");
  return xClientType === site.clientMark;
};
const normalResponse = (data: unknown) => {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
const errorResponse = (message: unknown) => {
  return new Response(JSON.stringify({ success: false, data: message }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
};
const return404 = () => new Response("Page Not found", { status: 404 });

const exec = async (req: Request, context: { params: Promise<Params> }) => {
  try {
    // unhandled request
    if (!hasXMark(req)) throw Error("Unauthorized");

    // get route and search
    const params = await context.params;
    const route = Array.isArray(params.routes)
      ? params.routes.join("/")
      : params.routes ?? "";
    const { search } = new URL(req.url);

    // get auth token
    const authToken = req.headers.get("Authorization");

    // get user agent
    const userAgent = req.headers.get("User-Agent");

    // get referer
    let referer = req.headers.get("Referer") ?? "";
    if (referer) {
      referer = referer.split("/").slice(0, 3).join("/");
    }
    // get origin IP
    const originIP =
      req.headers.get("CF-Connecting-IP") ??
      req.headers.get("x-forwarded-for") ??
      undefined;

    const data = req.method == "POST" ? await req.json() : undefined;
    // handle captcha
    if (route === "passport/comm/sendEmailVerify" && site.enableCaptcha) {
      await recaptcha(data.recaptcha_data, originIP ?? "");
    } else if (route == "user/appleid") {
      if (site.enableCaptcha) {
        await recaptcha(data.recaptcha_data, originIP ?? "");
      }
      const { data: idData } = await axios.get(site.appleId.url);
      let accounts: AppleData[] = [];
      if (idData.code === 200 && idData.accounts) {
        const length =
          site.appleId.maxCount === 0
            ? idData.accounts.length
            : site.appleId.maxCount > idData.accounts.length
            ? idData.accounts.length
            : site.appleId.maxCount;
        for (let i = 0; i < length; i++) {
          accounts.push(idData.accounts[i]);
        }
      }
      return normalResponse({
        success: true,
        data: accounts,
      });
    }

    const res = await request.request({
      url: route + search,
      method: req.method,
      headers: {
        Authorization: authToken,
        Origin: referer,
        "x-forwarded-for": originIP,
        "User-Agent": userAgent,
        "X-Forwarded-Host": req.headers.get("host") ?? "",
        "X-Forwarded-Proto": new URL(req.url).protocol.replace(":", ""),
      },
      data,
    });
    return normalResponse({ success: true, ...res.data });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const data = (e as AxiosError<ErrorResponse>).response?.data;
      return errorResponse(
        data?.errors ? Object.values(data?.errors) : data?.message
      );
    } else {
      return errorResponse((e as Error).message);
    }
  }
};
const recaptcha = async (recaptcha_data: string, originIP: string) => {
  try {
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    let formData = new FormData();
    formData.append("secret", site.secretKey);
    formData.append("response", recaptcha_data);
    formData.append("remoteip", originIP ?? "");

    const res = await axios.post(url, formData);
    if (res.data.success !== true) {
      throw Error();
    }
  } catch (e) {
    throw Error("未通过验证，请重试");
  }
};
const handler = async (
  request: Request,
  context: { params: Promise<Params> }
) => {
  const params = await context.params;
  if (!params.api) return return404();
  if (params.api !== site.apiPath) return return404();
  return await exec(request, context);
};
export const GET = handler;
export const POST = handler;
