---
title: 使用AI Agent制作Live2D模型
date: 2026-10-18
lang: zh
art: dots
---

> [!IMPORTANT] 重要建议
> See Through生成的PSD，还是手工精修下，否则很难达到要求，毕竟图层缺失的情况，Agent修复成本较高，其它的活它都能干了

## 成果展示

看我博客右下角（笑）。

## 前期准备

- 你的Agent + 模型，我使用的是 OpenCode + DeepSeek V4.1 Flash Free，完全免费的方案
- [psd2live](https://github.com/tsunehimatoi/psd2live)软件，支持MCP，这个软件是用来将分层PSD转换为Live2D模型，也是这次的核心软件
- 一个国区魔搭(Modelscope)账号，国区域名为: `modelscope.cn`，注册后就可以免费使用，然后找到See Through在线体验的页面: [See Through在线体验](https://modelscope.cn/studios/ljsabc/See-Through)，这一步是为了将你想做Live2D的人物形象拆分成分层PSD
- 可以自动化操控浏览器的工具 + Skill，我使用的是 [BrowserSkill](https://github.com/Tencent/BrowserSkill)，需要手动安装下BrowserSkill这个浏览器插件
- 自带CLI的开源Photoshop: [Photocraft](https://github.com/storytold/photocraft)，用于让Agent自动化编辑分层PSD

## 步骤

1. 先在上述的魔搭See Through那用你想要的人物形象生成分层PSD
2. 拿到分层PSD，建议自己打开看下，如果图层不全，拆分错误等，建议手动精修，缺失的部分可以用AI生成
3. 确保你的Agent可以控制浏览器和photocraft，并且连接好psd2live的MCP服务，然后将分层psd发给Agent，让它把这个psd放到psd2live里面，制作live2d模型，可以让它的生成产物支持live2d-widget的云端，Live2D Cubism Editor等。
4. 根据实际Live2D展示效果，让Agent帮忙修复骨骼绑定，动画，或是PSD图层都可以。