---
title: 如何使用Docker来运行EasyConnect
date: 2024-07-01
lang: zh
plum: true
---

# 拉取Docker镜像并启动

参考：[https://github.com/docker-easyconnect/docker-easyconnect](https://github.com/docker-easyconnect/docker-easyconnect)

以下只给出图形界面版EasyConnect的使用教程，因为命令行版不支持短信验证码的接收。

1. [安装Docker并运行](https://docs.docker.com/get-docker/)
2. 在终端输入： `docker run --rm --device /dev/net/tun --cap-add NET_ADMIN -ti -e PASSWORD=xxxx -e URLWIN=1 -v $HOME/.ecdata:/root -p 127.0.0.1:5901:5901 -p 127.0.0.1:1080:1080 -p 127.0.0.1:8888:8888 hagb/docker-easyconnect:7.6.7`（末尾 EasyConnect 版本号 7.6.7 请根据实际情况修改；arm64 和 mips64el 架构需要加入 -e DISABLE_PKG_VERSION_XML=1 参数）；
3. 使用vnc客户端连接vnc， 地址：127.0.0.1，端口: 5901, 密码 xxxx ; 成功连上后你应该能看到 EasyConnect 的登录窗口，填写登录凭据并登录。

# 本地配置http和socks5代理规则
上述Docker镜像会暴露以下端口：

```
5901: VNC
1080: socks5
8888: http
```

我们需要在本地配置代理才可以使用容器中的网络环境。

以Clash为例，这是一段示例配置(一般来说，你只需要修改其中的rules规则即可)：

```yaml
port: 7890
socks-port: 7891
allow-lan: true
mode: Rule
log-level: info
external-controller: :9090
proxies:
  - {name: vpn, type: socks5, server: 127.0.0.1, port: 1080}
proxy-groups:
  - name: EasyConnect
    type: select
    proxies:
      - vpn
rules: # 一般来说，以下三种规则足够覆盖大部分场景了
  - IP-CIDR,172.20.2.0/24,vpn # 对IP段172.20.2.xxx走代理
  - DOMAIN-SUFFIX,xxx.cn,vpn # 对结尾是xxx.cn的所有域名走代理，不用关心子域名有多少个
  - DOMAIN,www.abc.com,vpn # 对精确匹配的域名: www.abc.com做代理
```

然后启动Clash即可愉快地使用Docker版EasyConnect了

# 骚操作
在私人服务器/NAS中运行镜像，然后在个人电脑中远程使用的方法：

你的私服/NAS通常都做了内网穿透，因此，结合上述步骤，通过VS Code的ssh插件连接设备后使用插件的端口转发功能即可。
这样你不需要把镜像跑在本地，只需要运行Clash即可。