---
title: 我正在使用的工具
date: 2026-02-18
lang: zh
art: dots
---

## AI

我主要使用 ComfyUI 进行AI工作流的运行

### ComfyUI工作流

> [!IMPORTANT]
>
> 1. 在本地ComfyUI跑RunningHub工作流时，需注意有没有独占节点，这些节点ComfyUI是没有的，比如RH开头的一些，可以尝试寻找替代品。本篇文章在挑选工作流时，会规避这类工作流。
> 2. 在本地跑视频生成，您的本地显存最好大于24G，且尽量使用英伟达显卡。
> 3. 下载模型时，`HuggingFace`的请使用`hf-mirror.com`镜像站，而`civitai.com`的，在开启科学上网的条件下点击下载，然后**立即**关闭科学，下载不会断，别问我为什么要这样，血的教训，小心你的机场流量跑光！！

- [动漫插图制作](https://www.runninghub.cn/post/2010926888553811969): Illustrious模型, 配合[Lora](./note-lora-trigger)使用，根据底模不同，可以生成纯动漫，半写实，纯写实。
- [图片超分](https://www.runninghub.cn/post/1981316602547396610)
- [动漫转真人](https://www.runninghub.cn/post/2009908341815906305)
- [真人转动漫](https://www.runninghub.cn/post/2009866929703489537)
- [静态图生成动图](https://www.runninghub.cn/post/1984282159491989505)
- [数字人（语音驱动图片对口型说话）](https://www.runninghub.cn/post/1988165359964438530)：Bypass掉手动提示词的RunningHub Translator节点就可以本地跑了。

## 生产力

- Raycast: 万能工具，快速搜索文件，集成插件可实现多功能，代替Spotlight.
- Localsend: 局域网文件传输

## 编程

- 代码编辑器：Zed, VS Code, PyCharm.
- 编程语言：Rust, TypeScript, Python, JavaScript.
- 字体：[Input Mono](https://input.djr.com/)
- 主题：[Sakura-Chan(VSCode)](https://marketplace.visualstudio.com/items?itemName=vincent-the-gamer.sakura-chan-theme), [Catppuccin(Zed)](https://github.com/catppuccin/zed)

### 命令行工具

- uv: 最新的Python包管理器
- pnpm: 比npm更优秀的npm包管理器
- tsx: 免编译运行`.ts`文件
- zsh: 命令行工具，提供丰富的插件和主题，提高命令行效率。

## 媒体类

- 视频剪辑及后期：Final Cut Pro(macOS独占), Davinci Resolve, Adobe Premiere.
- 视频录制：OBS（直播及视频录制），Kap（动图录制）
- 音频处理：Ableton Live, iZotope RX 10
- 图像处理：Adobe Photoshop
