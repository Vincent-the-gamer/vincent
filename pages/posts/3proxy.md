---
title: 家用服务器使用3proxy开启socks5代理，使得在外网可以访问内网服务
date: 2025-08-07
lang: zh
art: dots
---

# 需求

我一直都在用内网穿透来访问家里的小主机，但是我之前都在使用Nginx配置来使得一个内网穿透隧道可以访问多个服务，
这样每次都需要去服务器上改配置，然后重启Nginx，稍微麻烦一些，所以现在就研究出了一个新办法，使用Clash配置规则代理，
通过服务器上的socks5端口访问服务，这样也是只需要穿透一个socks5端口即可。

# 操作

## 下载、配置、启动3proxy

在3proxy仓库的[GitHub Release](https://github.com/3proxy/3proxy/releases)可以下载。

下载后解压到文件夹，找到可执行文件，并在可执行文件同级目录创建一个`3proxy.cfg`配置文件：

```
# 设置超时时间
timeouts 1 5 30 60 180 1800 15 60
 
# 在windows上作为服务启动
service

# 内部IP地址，填客户端要通过那个IP访问服务器，一般填服务端部署，也就是安装3proxy这台主机的局域网IP，不允许填0.0.0.0, 127.0.0.1
internal 192.168.0.12

# 外部IP地址，填服务器通过哪个IP访问外网，一般填服务器的IP即可，填0.0.0.0也可以
external 0.0.0.0

#################################
#### socks4/4.5/5 proxy setting
#################################

auth none
flush
allow *

# 指定端口
socks -p11080
```

最后启动：
```shell
# 指定配置文件启动，默认取同级目录的
3proxy 3proxy.cfg
```

如果想注册为windows服务：
```shell
# 使用配置文件注册服务
3proxy.exe --install 3proxy.cfg

# 启动服务
net start 3proxy
```

Linux注册服务可以自行查阅，一般是写一个`systemctl`的配置

## 测试连通性

我使用`Clash`做代理客户端，如果你使用其它客户端，可以自行学习配置文件如何编写。

`Clash`配置如下：

```yaml
port: 7890
socks-port: 7891
allow-lan: true
mode: Rule
log-level: info
external-controller: :9090
proxies:
  # 注意这里server是你的socks5服务器ip和对应端口
  - {name: vpn-socks5-server, type: socks5, server: 192.168.0.12, port: 11080}
  # ssh -D 11080 xxx@服务器ip，通过ssh提供的socks5端口也可以走代理
  - {name: vpn-ssh, type: socks5, server: 127.0.0.1, port: 11080}
# 使用proxy-groups是因为可以拓展多种方式，比如你可以通过ssh连服务器，然后通过ssh提供本地socks5端口代理流量到服务器，可以将配置添加到这
proxy-groups:
  - name: MyProxies
    type: select
    proxies:
      - vpn-socks5-server
      - vpn-ssh
# 代理规则配置，自己研究去（
rules: 
  - DOMAIN-SUFFIX,xxx.com,MyProxies
  - IP-CIDR,188.88.0.0/16,MyProxies
  ...
```

然后使用`Clash`的延迟测速功能来测试连通性。

## 配置socks5端口的内网穿透

确认连通后，将你的socks5端口添加到你的内网穿透隧道中，然后将内网穿透的服务器和端口加进`Clash`配置文件，如果能够成功连通，你就可以使用了。

# 总结

经过以上操作，你就可以直接在外网访问你内网部署的服务了，如果你不懂Clash规则如何配置，可以看看这个文档：[Clash知识库](https://clash.wiki/configuration/configuration-reference.html)。