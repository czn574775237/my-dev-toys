"use client";

import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getAppConfig, setAppConfig } from "../config";
import { useRouter } from "next/navigation";

export default function AppSettingPage() {
  const [token, setToken] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    const appConfig = getAppConfig();
    console.log(appConfig);
    setToken(appConfig.token);
    setProxyUrl(appConfig.proxyUrl);
  }, []);

  const onSaveSetting = () => {
    // sk-SKdP42u8NDauYuiDLZQLhwKklabOLFqJLJY0MARfjHu4OzGh
    setAppConfig({
      token,
      proxyUrl,
  });
    router.replace("/search");
  };

  return (
    <div className="p-6">
      <h2 className="my-1">配置页面</h2>
      <p className="text-xs py-2">
        提示: 可以去
        <a
          className="text-[#08c] font-bold px-1"
          target="_blank"
          href="https://github.com/chatanywhere/GPT_API_free"
        >
          这里
        </a>
        获取免费 API TOKEN, 30次/小时, 点击下方
        <b>[申请领取内测免费API Key]</b>
        <a
          className="text-[#08c] pl-2"
          href="https://github.com/chatanywhere/GPT_API_free"
        ></a>
      </p>

      <Input
        type="text"
        label="API TOKEN"
        variant="underlined"
        className="max-w-xs"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <Input
        type="text"
        label="AI服务地址"
        // defaultValue="https://api.chatanywhere.com.cn"
        value={proxyUrl}
        onChange={(e) => setProxyUrl(e.target.value)}
        variant="underlined"
        className="max-w-xs"
        description="默认是 chat anywhere 的代理地址"
      />
      <div className="mt-2 ">
        <Button
          className="cursor-pointer"
          color="primary"
          size="sm"
          isDisabled={!token || !proxyUrl}
          onClick={onSaveSetting}
        >
          保存配置
        </Button>
        <Button
          className="ml-2"
          onClick={() => {
            router.replace("/search");
          }}
          size="sm"
        >
          {" "}
          返回
        </Button>
      </div>
    </div>
  );
}
