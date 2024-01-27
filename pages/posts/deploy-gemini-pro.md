---
title: 如何使用Vercel部署自己的Gemini Chat对话网站
date: 2023-12-23
lang: zh
plum: true
---

# 写在最前
需要魔法网络环境，没有的小伙伴就不必浪费时间看了。

**这里有热心群友提供他部署的Demo，大家可以试玩:** [https://gemini.rin.guru/](https://gemini.rin.guru/)

# 什么是Gemini
它是谷歌推出的多模态大模型，这意味着它可以处理各种信息，包括文本、代码、音频、图像和视频。你可以把它想象成一个多才多艺的小助手，擅长各种任务。

谷歌将其分为三个版本： Gemini Ultra （能力最强）, Gemini Pro（适用于多任务） 、Gemini Nano （适用于特定任务和端侧）。我们要搭建的对话网站基于Gemini Pro API。

# 什么是Gemini Chat
芝士<sup>（丁真语：这是）</sup>基于Gemini Pro的API所开发的一个前端页面，用于和API交互。

**GitHub地址：**[https://github.com/babaohuang/GeminiProChat](https://github.com/babaohuang/GeminiProChat)

# 使用Vercel搭建Gemini Chat网站

## 第一步：申请API Key

首先，申请自己的API Key: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

注意，这里需要魔法，而且需要特定地区的，如果你进入以后跳转到了这个页面：[https://ai.google.dev/available_regions?hl=zh-cn](https://ai.google.dev/available_regions?hl=zh-cn)

![google-api-region](/images/gemini-guide/google-ai-region.png)

则证明**你的魔法节点所在地区不支持申请API**, 请切换。

实测**小日子**的节点可行。

如果成功跳转会是这个界面：
![google-api-studio](/images/gemini-guide/google-ai-studio.png)

然后创建API Key即可。
![create-api-key](/images/gemini-guide/create-api-key.png)

创建完成以后会出现API key，可以复制出来待用。

**注意：API Key保密！API Key保密！API Key保密！**

## 第二步: 部署到Vercel

### 注册GitHub, 使用GitHub账号登录Vercel
通过 Vercel 平台进行一键部署，是完全免费的！

[https://vercel.com/](https://vercel.com/)

温馨提示：需要魔法！需要魔法！需要魔法！重要的事情说三遍！

首先，注册一个[GitHub](https://github.com/)账号，然后使用GitHub账号来登录Vercel。

如果让你选择账号类型，选择Hobby即可。

![vercel-account-1](/images/gemini-guide/create-vercel-account-1.png)

### 开始部署
进入GitHub项目：[https://github.com/babaohuang/GeminiProChat](https://github.com/babaohuang/GeminiProChat)

点击一键部署按钮：
![deploy](/images/gemini-guide/deploy.png)

然后按照提示，它会在你的GitHub中创建一个新的项目（建议勾上私有，因为涉及到API Key）

![create-git-repo](/images/gemini-guide/create-git-repo.png)

**关键步骤：配置API Key**

![configure](/images/gemini-guide/configure.png)

然后点击部署，它就会自动在你的GitHub仓库添加一个新的仓库，然后自动将网页部署好。

到这里，如果你的网站部署好，并且可以正常对话，那么你就完成啦！！！！(\*╹▽╹\*)

## 可能出现的幺蛾子
如果报错：`User location is not supported for the API use.`，则证明你当前的网络环境无法直接连通API，这也是之前提到的地区问题。

![error](/images/gemini-guide/gemini-error.png)

解决办法：部署反向代理vercel服务。

使用这个项目：[https://github.com/antergone/palm-proxy](https://github.com/antergone/palm-proxy)

同样的，使用Vercel一键部署

然后，编辑你之前部署的`gemini-pro-chat`项目的环境变量：

增加一条:

Key: `API_BASE_URL`
Value: `你的palm-proxy部署好的域名`

然后访问就正常了，因为Vercel服务在它支持的地区。

![modify-1](/images/gemini-guide/modify-env-1.png)
![modify-2](/images/gemini-guide/modify-env-2.png)