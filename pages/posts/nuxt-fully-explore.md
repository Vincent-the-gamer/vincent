---
title: Nuxt3深入探索
date: 2025-07-03
lang: zh
art: dots
---

# 前言

最近在做一个工具项目：[Mayu](https://mayu.vince-g.xyz/), 目的是提供可通过UI快速操作的多个功能，同时将这些功能通过API的形式部署在公网，供其它地方使用。使用Next.js(基于React)或Nuxt.js(基于Vue)的全栈框架配合Netlify, Vercel等平台就可以快速实现这样的服务。我平时写Vue比较多，所以使用后者。

# Nuxt 3基本使用

> [!NOTE] 注意
> 目前Nuxt主流版本是Nuxt 3，不建议去学Nuxt 2了，下面所有的「Nuxt」均指代Nuxt 3。

如果在使用Nuxt前，你还不会Vue 3，请先通过[Vue 3官方文档](https://cn.vuejs.org/)进行学习。此外，你可以结合[Nuxt 3官方文档](https://nuxt.com.cn/)和[Nitro官方文档](https://nitro.build/)来更好地探索Nuxt等用法。

Nuxt是一个[服务端渲染（SSR）](https://cn.vuejs.org/guide/scaling-up/ssr.html#server-side-rendering-ssr)框架，其打包成品是一个Nitro服务器，由Vue框架驱动前端页面的渲染，Nitro框架提供API接口等功能。

这里只做简单介绍，诸如**如何初始化项目**等基础知识，请查阅文档进行学习，本文不再赘述。

注意，在使用Nuxt前，请明确你的需求，如果你只是希望在你的Vue项目中加入**基于文件的路由(File-based Routing)**功能，那么大可不必为了该功能而起一个Nuxt项目，你可以使用[unplugin-vue-router](https://github.com/posva/unplugin-vue-router)插件来实现这个功能。

# 项目结构

通过脚手架初始化的Nuxt 3项目是非常简洁的，很多文件夹和配置是默认不会给的。我们将在之后改造基础项目，这里先说明一下大概的项目结构。

```
project-root/
- assets   打包进js的资产文件（图片等）
- components 普通自定义组件
- layouts  布局组件，可以创建自定义布局
- pages    路由页面组件
- plugins  Nuxt插件
- public   静态文件
- server   服务端(Nitro)
  | - api   API存放目录, 文件格式为xxx.get.ts, xxx.post.ts等
  | - assets 服务端资产，如json数据等
  | - middleware  服务端中间件
  | error.ts 服务端通用错误处理
app.vue    页面入口
error.vue  通用错误页面
nuxt.config.ts  Nuxt配置文件


...其它目录省略
```

随着你需求的变化，可能会有更多目录，比如你希望集成项目文档，使用Markdown渲染，那么一般使用`@nuxt/content`来集成到Nuxt项目中，此时Nuxt就会自动读取根目录下的content文件夹下的markdown文件进行渲染。


# 改造基础项目

## 配置文件

经过我的探索，给出一个相对实用的基础配置:

`nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  experimental: {
    clientNodeCompat: true, // 让客户端可以使用Node环境的方法，如Buffer的操作（浏览器环境下不能操作Buffer）
  },
  plugins: [
    '~/plugins/node-client', // 配合clientNodeCompat的插件，将Buffer，process等挂载到globalThis，下面会给出这个plugin的内容
  ],
  app: {  // Nuxt 3开发项目中没有index.html，所以关于页面的配置在这里进行，如head等
    head: {
      title: 'Mayu',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      charset: 'utf-8',
      meta: [
        { name: 'referrer', content: 'no-referrer' },
      ],
    },
  },
  // 要引入全局css文件可以在这里引入
  css: [
    '~/assets/css/main.scss',
  ],
  // 推荐使用unocss来让你的样式编写更舒服，当然也可以不用
  modules: [
    '@unocss/nuxt',
  ],
  compatibilityDate: '2024-11-16',
  logLevel: 'info',
  devServer: {
    port: 8500,
  },
  devtools: {
    enabled: true,
  },
})
```

`plugins/node-client.ts`:

```ts
import { Buffer } from 'node:buffer'
import process from 'node:process'

globalThis.Buffer = Buffer
globalThis.process = process

export default defineNuxtPlugin({})
```

## `server`文件夹

server文件夹是服务端的内容，使用方法与Nitro基本一致，API接口放在`server/api`文件夹下。需要注意的是默认不支持跨域请求，需要配置一下。

这里使用`server/middleware`文件夹，Nuxt会读取这个文件夹的`.ts`文件作为服务端中间件，在每个请求发起前，进行读取headers，记录日志等操作。


如果你需要使用中间件允许请求跨域，可以创建`server/middleware/cors.ts`:

```ts
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Expose-Headers': '*',
  })
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.statusMessage = 'No Content.'
    return 'OK'
  }
})
```

如果你需要Nuxt打印日志，可以添加`server/middleware/logger.ts`:

你可以使用任意一个日志库来打印日志，我这里用的是`tslog`。

```ts
import type { ILogObj } from 'tslog'
import { Logger } from 'tslog'

const logger: Logger<ILogObj> = new Logger()

export default defineEventHandler((event) => {
  logger.info(`Request: method=${event.method}, path=${event.path}`)
})
```

错误日志打印：创建`server/error.ts`：

```ts
import type { ILogObj } from 'tslog'
import { Logger } from 'tslog'

const logger: Logger<ILogObj> = new Logger()

export default defineNitroErrorHandler((error, event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain')
  logger.error(`Error: ${error.stack}`)
  return send(event, `[custom error handler] ${error.stack}`)
})
```

## 其它工具

由于Nuxt的SSR特性，你日常在Vue中使用的工具可能不能直接使用，需要安装**适配Nuxt的版本**，可以在[这里](https://nuxt.com.cn/modules)搜索，例如：

`nuxt.config.ts`中：
```ts
modules: [
    '@unocss/nuxt', // 适配Nuxt的UnoCSS
    '@pinia/nuxt', // 适配Nuxt的Pinia
    ...
],
```

# 在不同平台部署

我们的Nuxt项目可以在服务器端通过node-server的形式打包部署，也可以通过Netlify，Vercel进行部署，区别是构建的预设(preset)不同，如

```shell
pnpm run build   # 在本地环境默认构建node-server
pnpm run build --preset netlify   # 为netlify构建，通常不用手动执行，因为netlify会帮你完成
```

针对不同环境，我们可能需要返回服务端的静态文件，此时需要获取服务端的url，所以我们需要对环境进行区分。

这里和Nitro服务端配置方式完全相同，通过`nuxt.config.ts`添加配置：
```ts
runtimeConfig: {
    baseUrl: 'https://xxx.com/xxx',
},
```

runtimeConfig是在`生产环境中`，即项目构建后，你能够读取的变量，通过对应的key来读取。

而在`开发环境`中，可以通过`.env`文件来配置：

```conf
# 注意，nuxt中前缀是NUXT_，而nitro中是NITRO_
NUXT_BASE_URL=http://localhost:8500
```

然后就可以通过:

```ts
const { baseUrl } = useRuntimeConfig(event)
```

在服务端中读取。


# 后续

之后在使用Nuxt 3的过程中，我还会持续探索，目前先做到对一个Nuxt项目进行基本的强化改造，之后我会做一个模板，省得每次起Nuxt项目都要配置。