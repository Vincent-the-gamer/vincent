---
title: 安利一些前端的工具
date: 2024-2-22
lang: zh
plum: true
---

> **注意:** 该篇博客会**陆陆续续更新**，记得经常回来看看喵~(๑•̀ㅂ•́)و✧

# Unplugin系列
Unplugin(The Unified Plugin System)是前端开源社区搞出来的一套为各种构建工具提供统一插件系统的库。它扩展了 Rollup 插件 API，作为标准插件接口，并提供多个前端构建工具(Vite, Webpack, esbuild, Rspack, *未来还会支持更多* )的兼容层。

[https://unplugin.vercel.app/](https://unplugin.vercel.app/)

## 我目前用到的
### unplugin-auto-import
这个插件可以让你的前端项目在编译时自动引入一些库，而不用在代码中手动引入。该工具支持多个前端框架和打包工具。

[https://github.com/unplugin/unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)

只需要进行简单的配置，就可以对前端工程中大量重复的模块引入代码进行省略。

### unplugin-vue-components
和上面的类似，不过是针对`Vue项目`, 自动引入`src/components`下所有组件的。

[https://github.com/unplugin/unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)

## 举个栗子🌰

以我的Vue项目: [CardForge](https://github.com/Vincent-the-gamer/cardforge) 作为例子:

### 使用前
引入插件前，在组件文件中需要引入`vue`相关的API, 引入自己封装的`.ts`文件等

```ts
import { ClassType, KindType, Flag, Rarity, CardType, WaterMark } from '@/datatypes/card';
import CardFace from '@/components/CardFace.vue';
import Number from '@/components/Number.vue';
import ArcText from "@/components/ArcText.vue"
import { useStore } from '@/store/useStore';
import { computed } from 'vue';
import Mask from './Mask.vue';
import useStyledDescription from "@/hooks/useStyledDescription"
import Watermark from './Watermark.vue';
import { useI18n } from 'vue-i18n';

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
            imports: [ // 配置需要自动导入的包，这里是一些官方提供可选项的包
                "vue",
                "@vueuse/core",
                "vue-i18n",
                // 引入类型
                {
                    from: '@vueuse/core',
                    imports: ['Fn'],
                    type: true,
                },
            ],
            dts: true, // 生成.d.ts声明文件
            // 引入自己封装的一些.ts文件，记得把模块统一使用index.ts导出
            dirs: [
                "./src/hooks",
                "./src/datatypes",
                "./src/store"
            ],
            vueTemplate: true  // 允许 vue 单文件组件中自动引入
        }),
        // 组件自动引入，默认引入src/components下，可以自己配置其它后缀文件的自动引入
        Components({
            dts: true,
        })
    ],
})
```

这样，我们在写前端的时候就不用手动import啦（づ￣3￣）づ╭❤～

### 附：对比效果
使用前:

```vue
<script lang="ts" setup>
import { ClassType, KindType, Flag, Rarity, CardType, WaterMark } from '@/datatypes/card';
import CardFace from '@/components/CardFace.vue';
import Number from '@/components/Number.vue';
import ArcText from "@/components/ArcText.vue"
import { useStore } from '@/store/useStore';
import { computed } from 'vue';
import Mask from './Mask.vue';
import useStyledDescription from "@/hooks/useStyledDescription"
import Watermark from './Watermark.vue';
import { useI18n } from 'vue-i18n';


const store = useStore()
const { locale } = useI18n()
// 省略
</script>
```

使用后：
```vue
<script lang="ts" setup>
const store = useStore()
const { locale } = useI18n()

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
import App from "./App.vue";
import { createRouter, createWebHistory } from 'vue-router/auto'

const app = createApp(App)
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
})
app.use(router)
app.mount("#app")
```

最后，在`src目录`下创建pages文件夹，然后直接添加组件，即可使用`基于文件的路由(File-based Routing)`了。
不了解`File-based Routing`的小伙伴，请参考[Nuxt.js文档](https://nuxt.com.cn/)


# 未完待续
记得常回来看看(\*^▽^\*)