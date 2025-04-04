---
title: 如何使用迷你主机搭建自己的私有云服务器
date: 2023-12-24
lang: zh
art: dots
---

# 起因

之前去TX云整了个最便宜的首年30块还是50块左右的云服务器，结果配置只有1G内存2核CPU，性能拉胯的一批。

当我在我的服务器部署了以下服务时，它内存和CPU占用经常拉满：

- `Minio` 对象存储服务，用来保存各种文件
- `Koishi` 机器人框架
- `go-cqhttp` 用于qq机器人（现在已经成为历史，悲o(╥﹏╥)o 啊啊啊，我的go-cqhttp啊！！！！）
- 自己写的几个杂七杂八的小服务(占用很低)
- `Docker` 是的，你没有看错，就是Docker一跑，我只跑了一个容器，有时候直接就拉满了，我ssh经常连不上。

真是绝了，所以，在意识到我租不起云服务器后，我发现了迷你主机这个东东。

# 选购设备

## 需求

设备的选购取决于需求，我先说说我的需求：

- 成本足够低
- 迷你主机(功耗低，噪音低，不占地方)
- 至少16G内存
- 既可以当个人电脑，也可以当服务器

所以我就选了一个已经低端得不能再低端的`天钡T-box 16G + 512G`（懒得上图了，自己去查，也规避一下广告嫌疑）。

没错，我甚至没有上1T硬盘，因为我的想法是自己外接一个2T固态当资源盘（）。

**PS: 其实我事后后悔没有买Intel Nuc 7，毕竟老机子也很便宜（）**

## 详细配置

这玩意的配置如下：

![tbao](/images/posts/tbao-tbox.png)

**注意：准系统无硬盘，但是有内存，可以选8GB内存或16G内存**

- **CPU**: 其实也没啥可关注的，N100这个CPU是很多小主机都会配备的低端低功耗的CPU，7nm工艺，4核心4线程，睿频3.4GHz。
- **内存**: 标配8GB LPDDR5 4800内存, 最高支持16G(我选择16G)，用来跑跑代码，当Nas啥的，还能当个人电脑用勉强算够。
- **硬盘规格**：M.2 SATA/PCIE 3.0 SSD 2242， 注意是2242，也就是说长固态安不进去（），所以我是选的自带512G，最高支持1T。
- **USB**: 3个USB 3.1
- **HDMI**: 3个HDMI 2.0
- **以太网口**：2个千兆网口
- **不是准系统**的话，会预装**操作系统**：Win 11
- **重量**: 203.7g，很轻
- **无线网卡**： 瑞昱Realtek 8821CE
- **有线网卡**: 瑞昱Realtek 8168

机身上还有3.5mm耳机接口（未来科技！！！！），12V直流电源接口，支持12V 2.5A供电。

# 安装系统

如果你选择的不是**准系统**，它预装了**Windows 11**，如果你不需要其他操作系统，那么你可以开箱即用了，这一部分也可以不用看。

如果你选择的是**准系统**， 那么你自己安装好固态以后，需要**手动安装系统**。

或者你想要安装其它系统，就可以看下去。

## 制作系统安装U盘

下载你想安装的系统iso镜像，然后准备一个U盘来写入镜像（注意U盘会被格式化掉，建议准备一个空U盘或者不用的U盘，推荐至少8G的，实在不行可以用4G的来试试）。

如果你现在手头使用的是Windows电脑，推荐使用[Rufus](https://github.com/pbatard/rufus)来写入系统镜像，macOS下则是[Balena Etcher](https://github.com/balena-io/etcher)。

我在这里安装的是<a href="https://archlinux.org/" target="_blank"><span i-logos-archlinux/>Arch Linux</a>操作系统。

有关于Arch Linux的详细介绍，在以后的博客我也许会写吧（笑）。

## 进入BIOS, 选择从U盘启动

针对我的小主机，进入BIOS的方法是：开机连续按下**delete**键。同时这款小主机是支持UEFI引导的。

如果你选购其他机器，**进入BIOS方法有所不同**，建议**看说明书**或者**询问客服**。然后搞清楚它是否支持UEFI引导（不过一般新设备都会支持的）。

先进入BIOS, 将启动引导顺序的第一个设置为U盘，然后重启，就可以进入U盘安装镜像了。

## 安装流程

一般地，安装流程都是全自动傻瓜式的，等待它自动安装完毕重启后就好。<sup>除了Arch Linux这种邪教或者Gentoo这种异端之外</sup>（笑）。

Arch Linux的安装流程我大概也许会在之后的博客里写吧（）。

## 安装完成后

安装完成后，重启，重新进入BIOS，将你安装好的系统引导启动顺序调至第一个，然后再重启，此时应该能正常进入系统了。

# 部署内网穿透

这一步是为了让你在本地部署的服务可以在外网访问，我使用的是[SakuraFrp](https://www.natfrp.com/)，你也可以自己选择其它服务。

详细过程因为服务的不同而相异。

# 最后

1. 在家里就使用局域网IP访问你部署的服务吧，别浪费内网穿透流量，在外面再使用内网穿透的IP。
2. 祝你玩的开心。
