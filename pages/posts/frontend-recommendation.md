---
title: 安利一些前端的工具
date: 2025-04-02
lang: zh
art: dots
---

> [!IMPORTANT] 重要
> 该篇博客会**陆陆续续更新**，记得经常回来看看喵~(๑•̀ㅂ•́)و✧

# 包管理器

## pnpm

pnpm是一个比npm更快的node包管理器 **(官方号称快2倍)**，并且提供了内置的monorepo(一个项目中含有多个node package)支持。 用法类似于npm, yarn，这里不详述。

官方文档:

[pnpm英文](https://pnpm.io/)

[pnpm中文](https://pnpm.io/zh/)

# 工具包

## Unplugin系列

Unplugin(The Unified Plugin System)是前端开源社区搞出来的一套为各种构建工具提供统一插件系统的库。它扩展了 Rollup 插件 API，作为标准插件接口，并提供多个前端构建工具(Vite, Webpack, esbuild, Rspack)的兼容层。

> [!NOTE]
> 未来还会支持更多

[https://unplugin.vercel.app/](https://unplugin.vercel.app/)

### unplugin-auto-import

这个插件可以让你的前端项目在编译时自动引入一些库，而不用在代码中手动引入。该工具支持多个前端框架和打包工具。

[https://github.com/unplugin/unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)

只需要进行简单的配置，就可以对前端工程中大量重复的模块引入代码进行省略。

### unplugin-vue-components

和上面的类似，不过是针对`Vue项目`, 自动引入`src/components`下所有组件的。

[https://github.com/unplugin/unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)

**举个栗子🌰**

以我的Vue项目: [CardForge](https://github.com/Vincent-the-gamer/cardforge) 作为例子:

### 使用前

引入插件前，在组件文件中需要引入`vue`相关的API, 引入自己封装的`.ts`文件等

```ts
import ArcText from "@/components/ArcText.vue";
import CardFace from "@/components/CardFace.vue";
import Number from "@/components/Number.vue";
import {
  CardType,
  ClassType,
  Flag,
  KindType,
  Rarity,
  WaterMark,
} from "@/datatypes/card";
import useStyledDescription from "@/hooks/useStyledDescription";
import { useStore } from "@/store/useStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import Mask from "./Mask.vue";
import Watermark from "./Watermark.vue";

// 此处省略一万字...
```

是不是很烦人？而且很多组件都要这么引入，这就有点浪费时间了。所以，我们配合`unplugin-auto-imports` 和 `unplugin-vue-components` 可以实现上面这一堆都不用写的效果。

### 使用后

现在来使用插件，在`vite.config.ts`中，增加`AutoImport`和`Components`配置

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    // ...
    AutoImport({
      imports: [
        // 配置需要自动导入的包，这里是一些官方提供可选项的包
        "vue",
        "@vueuse/core",
        "vue-i18n",
        // 引入类型
        {
          from: "@vueuse/core",
          imports: ["Fn"],
          type: true,
        },
      ],
      dts: true, // 生成.d.ts声明文件
      // 引入自己封装的一些.ts文件，记得把模块统一使用index.ts导出
      dirs: ["./src/hooks", "./src/datatypes", "./src/store"],
      vueTemplate: true, // 允许 vue 单文件组件中自动引入
    }),
    // 组件自动引入，默认引入src/components下，可以自己配置其它后缀文件的自动引入
    Components({
      dts: true,
    }),
  ],
});
```

这样，我们在写前端的时候就不用手动import啦（づ￣3￣）づ╭❤～

### 附：对比效果

使用前:

```vue
<script lang="ts" setup>
import ArcText from "@/components/ArcText.vue";
import CardFace from "@/components/CardFace.vue";
import Number from "@/components/Number.vue";
import {
  CardType,
  ClassType,
  Flag,
  KindType,
  Rarity,
  WaterMark,
} from "@/datatypes/card";
import useStyledDescription from "@/hooks/useStyledDescription";
import { useStore } from "@/store/useStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import Mask from "./Mask.vue";
import Watermark from "./Watermark.vue";

const store = useStore();
const { locale } = useI18n();
// 省略
</script>
```

使用后：

```vue
<script lang="ts" setup>
const store = useStore();
const { locale } = useI18n();

// 省略
</script>
```

### unplugin-vue-router

需要配合`unplugin-auto-import`使用，使得你的`vue-router`变成`基于文件的路由(File-based Routing)`。

以`Vite`为例，配置如下：

首先配置`vite.config.ts`:

```ts
...
import AutoImport from "unplugin-auto-import/vite"
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
...

export default defineConfig(async () => ({
  ...
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        VueRouterAutoImports,
        {
          'vue-router/auto': ['useLink'],
        },
      ],
      dts: true,
      vueTemplate: true
    }),
    VueRouter(),
    ...
  ]

  ...
}))
```

然后在`src目录`的入口文件`main.ts`中：

```ts
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router/auto";
import App from "./App.vue";

const app = createApp(App);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
});
app.use(router);
app.mount("#app");
```

最后，在`src目录`下创建pages文件夹，然后直接添加组件，即可使用`基于文件的路由(File-based Routing)`了。
不了解`File-based Routing`的小伙伴，请参考[Nuxt.js文档](https://nuxt.com.cn/)

# UnJS系列

## Unconfig

[Unconfig](https://github.com/antfu-collective/unconfig)是用于开发Node.js模块时，为你提供配置文件读取的功能库。如果你想为自己的Library提供一个用户自定义配置文件的功能，那么这个库会为你省去「编写加载对应配置文件的代码」这一步骤。

一般来说，你可以在项目中定义一个`resolveConfig`方法，然后处理配置。我们的配置一般会有三份：默认配置，用户配置文件(xx.config)，函数传入的配置对象，权重排序一般为：

```
函数传入的配置对象 > 用户配置文件(xx.config) > 默认配置
```

如果调用者在使用了配置文件的同时，还在函数传入了配置，我们通常应该在解析配置时，按照权重将相同属性覆盖为权重更高的值，而其余属性继续取配置文件的值，而配置文件如果不存在或者缺少部分属性，则取默认属性，默认属性为空则为`undefined`。

一般来说，使用`unconfig`来定义一个配置解析方法可以这样做：

```ts
import { loadConfig } from 'unconfig'
import deepmerge from 'deepmerge'

// 默认配置
export const default: Config = {
  name: "纯黑"
}

// config: 传入的配置
async function resolveConfig(incomingConfig: Config) {
  ...

  // 读取你的配置文件
  const { config, sources } = await loadConfig({
    sources: [
      // 定义：配置将从当前目录的 `my.config.xx` 中读取
      {
        files: 'my.config',
        // 允许的默认文件后缀
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
      },
    ]
    // false: 读取sources第一个配置
    // true: 混合多个配置文件的配置信息
    merge: false,
  })

  // 如果没有读取到配置文件(sources.length不存在)，直接将传入的配置与默认配置混合（并覆盖对应属性）
  if (!sources.length)
    // 使用deepmerge库可以简单实现覆盖功能，注意，第二个参数覆盖第一个参数里的对象
    return deepmerge(default, incomingConfig)

  // 如果读取到了配置文件，注意权重，需要先把配置文件覆盖到默认配置，然后将传入的配置继续覆盖
  return deepmerge(deepmerge(default, config), incomingConfig)
}
```

这样就可以在你的代码中优雅地读取配置了。具体案例可以参考我的库：[fast-dirpy](https://github.com/Vincent-the-gamer/fast-dirpy).
