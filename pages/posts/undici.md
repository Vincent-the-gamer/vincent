---
title: 在Node.js中使用Undici打通JS/TS代码与本地梯子
date: 2025-03-25
lang: zh
plum: false
---

# 网络的局限性

老生常谈的话题了，对于无法访问到的服务端，我们通常会在本地开启一个网络代理，使得特定流量通过代理服务器就可以成功访问到目标服务器（规则代理模式），同时，它会打开本地的特定端口，提供`http`,`socks5`或基于其它协议的代理服务，使得开发者也可以在代码中访问远程服务器。

# Node.js环境中使用undici

对于Node.js代码，我们使用`undici`这个库可以使得代码中的方法在发起网络请求时，可以通过我们本地的代理端口。

```ts
import { setGlobalDispatcher, ProxyAgent } from "undici"

const proxyHost = "127.0.0.1"
const proxyPort = 7890

const dispatcher = new ProxyAgent({
   uri: new URL(`http://${proxyHost}:${proxyPort}`).toString()
})
setGlobalDispatcher(dispatcher)
```

这样，在当前这个脚本环境中，我们就成功与本地的代理端口打通连接了。