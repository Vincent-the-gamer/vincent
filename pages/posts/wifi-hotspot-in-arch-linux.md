---
title: 在Linux设备中开启Wifi热点
date: 2023-12-25
lang: zh
---

# 前言
本篇文章以`Arch Linux`为例

# 硬件需求
Wifi设备中需要支持AP模式，使用命令查看：

```shell
iw list
```
Arch Linux中如果没有iw, 安装即可：
```shell
sudo pacman -S iw
```

在接口列表中找到有AP模式即可：
```
Supported interface modes:
    * IBSS
    * managed
    * AP
    * P2P-client
    * P2P-GO
    ....
```

# 工具
安装AUR的包：`wifi-hotspot` `dnsmasq`（需要添加archlinuxcn源）

使用你的AUR助手，如`yay`，`paru`来安装。

```shell
# paru可替换成你的AUR助手，如yay
paru -S wifi-hotspot dnsmasq
```

然后图形化界面搜索`Wifi Hotspot`打开，如下图。

配置你的SSID（Wifi名称）和密码，`Wifi Interface`选择你的无线网卡，`Internet Interface`选择你当前连接互联网的网卡，可以是无线也可以是以太网口。

然后启动热点即可。同时，你也可以选择要启用的Wifi频段（2.4G/5G）。

![hotspot](/images/posts/linux-wifi-hotspot.png)