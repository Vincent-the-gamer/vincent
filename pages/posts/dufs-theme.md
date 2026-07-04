---
title: 给dufs配一个好看的前端
date: 2026-07-04
lang: zh
art: dots
---

# 简介

Dufs是一个简单的文件管理程序，可以基于Web端来管理你电脑上的文件，默认打开dufs主程序所在目录，所以，你可以把它当作你的个人网盘程序。

GitHub: https://github.com/sigoden/dufs

具体使用方法不赘述，请看项目仓库。

## 默认Web页面美化

当你运行dufs后，打开它的webui，发现是这样的：

![dufs-webui](/images/posts/dufs/dufs.png)

感觉稍稍有点简陋，所以我们用这个前端包来美化下：https://github.com/TransparentLC/dufs-material-assets

从Release可以下载这个项目构建好的包，如果你不想配置的话，直接用这个前端启动Dufs：

```bash
# 假设你的前端资源文件夹名是dufs-material-assets，如果你改名了，就用你改的名字，比如assets啥的
dufs --assets dufs-material-assets
```

可以看到这样的界面：

![asset-plain](/images/posts/dufs/asset-plain.png)

所以我们可以配置一下背景图片啥的，修改`index.html`：

在`index.html`的`<script>`部分添加`window.__DUFS_MATERIAL_CONFIG__`

```js
window.__DUFS_MATERIAL_CONFIG__ = {
    // 网页标题
    document: 'Index of ${path} - Custom title',
    // 左上角显示的标题和 LOGO
    page: {
        title: 'Custom title',
        logo: {
            light: 'https://example.com/logo-light.png',
            dark: 'https://example.com/logo-dark.png',
        },
        // 也可以在浅色和深色主题下使用同一个 LOGO
        // logo: 'https://example.com/logo.png',
    },
    // 自定义页脚
    // 可以使用 Markdown 格式
    footer: 'Copyright © 2025 **John Doe** ![](https://img.shields.io/badge/any_text-you_like-blue)\\n\\n[京ICP备XXXXXXXX号-X](https://beian.miit.gov.cn/)',
    // 背景图片
    background: {
        light: 'https://example.com/background-light.webp',
        dark: 'https://example.com/background-dark.webp',
    },
    // 也可以在浅色和深色主题下使用同一张背景图片
    // background: 'https://example.com/background.webp',
    // 浅色和深色主题
    // 参见 https://vuetifyjs.com/zh-Hans/features/theme/ 的 colors 部分
    theme: {
        light: {
            primary: '#0288d1',
            secondary: '#00b0ff',
        },
        dark: {
            primary: '#026da7',
            secondary: '#008dcc',
        },
    },
    // 为卡片添加毛玻璃效果
    // 可以设置模糊半径（单位 px）和不透明度（范围 0-1）
    // 建议和背景图片配合使用
    glassmorphism: {
        // 顶部应用栏
        appbar: { blur: 5, alpha: .6 },
        // 文件列表
        filelist: { blur: 5, alpha: .8 },
        // README
        readme: { blur: 5, alpha: .8 },
        // 预览窗口
        preview: { blur: 5, alpha: .8 },
    },
    // 分页大小
    limit: 100,
    // 是否允许使用第三方服务查看文件（Microsoft Office Online、draw.io、Photopea）
    // 部署时需要满足对应条件，否则即使启用了也无法查看
    externalViewer: false,
};

// 由 dufs 填充的页面内容，不要修改
window.__DUFS_PREFIX__ = "__ASSETS_PREFIX__";
window.__INITIAL_DATA__ = JSON.parse(decodeURIComponent(escape(atob("__INDEX_DATA__"))));

```

配置后可以稍微好看点：

![asset-back](/images/posts/dufs/asset-back.jpeg)

当然，你也可以修改前端js和css来集成更好看的UI，具体案例可以看项目仓库给出的示例网站：

https://fuwafuwa.akarin.dev/