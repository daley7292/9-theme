export const site = {
  api: "https://api.redleaf.cloud",
  enableCaptcha: false,
  secretKey: "1x0000000000000000000000000000000AA",
  siteKey: "1x00000000000000000000AA",
  apiPath: "next",
  clientMark: "next",
  background: null,
  appleId: {
    enable:false,
    url: "https://example.com",
    disallowedPlanIds: [99],
    maxCount: 0,
  },
  chatwoot:{
    enable:true,
    base_url:"https://chat.0200.xin",
    website_token:"kiantHn6Dwh8pBm5gU5g37Up"
  },
  locales: [
    {
      key: "zh-CN",
      icon: "twemoji:flag-china",
      label: "简体中文",
    },
  ],
  clients: [
    {
      key: "Android",
      icon: "simple-icons:android",
      link: "https://download.redleaf.app/redleaf-3.0.1-android-arm64-v8a.apk",
    },
    {
      key: "Windows",
      icon: "material-symbols:window",
      link: "https://download.redleaf.app/redleaf-3.0.1-windows-amd64-setup.exe",
    },
    {
      key: "Mac(Intel)",
      icon: "simple-icons:apple",
      link: "https://download.redleaf.app/redleaf-3.0.1-macos-amd64.dmg",
    },
    {
      key: "Mac(Apple)",
      icon: "simple-icons:apple",
      link: "https://download.redleaf.app/redleaf-3.0.1-macos-arm64.dmg",
    },
  ]
};
