type AppConfig = {
  token: string;
  proxyUrl: string;
};
const APP_CONFIG_STORAGE = "_APP_CONFIG";
export function setAppConfig(config: AppConfig) {
  localStorage.setItem(APP_CONFIG_STORAGE, JSON.stringify(config));
}

export function getAppConfig(): AppConfig {
  const config = localStorage.getItem(APP_CONFIG_STORAGE);

  if (config) {
    return JSON.parse(config);
  } else {
    return {
      token: "",
      proxyUrl: "https://api.chatanywhere.com.cn",
    };
  }
}
