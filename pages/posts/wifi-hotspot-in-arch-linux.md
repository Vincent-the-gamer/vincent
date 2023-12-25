---
title: 在Linux设备中开启Wifi热点
date: 2023-12-25
lang: zh
---

# 前言
本篇文章以`Arch Linux`为例，其它Linux系统也可以参考。

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

# 安装热点工具
主要使用的工具是`linux-wifi-hotspot`。

GitHub项目地址：[https://github.com/lakinduakash/linux-wifi-hotspot](https://github.com/lakinduakash/linux-wifi-hotspot)

## Debian/Ubuntu（或基于它们的下游发行版）

- Debian：[在Release中找安装包即可](https://github.com/lakinduakash/linux-wifi-hotspot/releases)
- Ubuntu: 目前包已过时，等待作者修复
```shell
# For ubuntu - package outdated due to lost GPG keys
sudo add-apt-repository ppa:lakinduakash/lwh
sudo apt install linux-wifi-hotspot
```

## Arch Linux (或基于Arch的下游发行版)
安装AUR的包：（需要添加archlinuxcn源）

- `linux-wifi-hotspot`（或者`wifi-hotspot`） 
- `dnsmasq`

使用你的AUR助手，如`yay`，`paru`来安装。

```shell
# Arch Linux or Arch-based
# paru可替换成你的AUR助手，如yay
paru -S linux-wifi-hotspot dnsmasq
```

# 启动热点工具
以下选项二选一即可，有图形化的建议优先选择图形化。

## 图形化界面工具
图形化界面下，搜索`Wifi Hotspot`打开，如下图。

配置你的SSID（Wifi名称）和密码，`Wifi Interface`选择你的无线网卡，`Internet Interface`选择你当前连接互联网的网卡，可以是无线也可以是以太网口。

然后启动热点即可。同时，你也可以选择要启用的Wifi频段（2.4G/5G）。

![hotspot](/images/posts/linux-wifi-hotspot.png)

## 命令行工具
1. 修改配置文件

```shell
sudo vim /etc/create_ap.conf
```

配置文件内容如下：
```shell
CHANNEL=default
GATEWAY=192.168.12.1
WPA_VERSION=2
ETC_HOSTS=0
DHCP_DNS=gateway
NO_DNS=0
NO_DNSMASQ=0
HIDDEN=0
MAC_FILTER=0
MAC_FILTER_ACCEPT=/etc/hostapd/hostapd.accept
ISOLATE_CLIENTS=0
SHARE_METHOD=nat
IEEE80211N=0
IEEE80211AC=0
HT_CAPAB=[HT40+]
VHT_CAPAB=
DRIVER=nl80211
NO_VIRT=0
COUNTRY=
FREQ_BAND=2.4
NEW_MACADDR=
DAEMONIZE=0
NO_HAVEGED=0
WIFI_IFACE=wlan0
INTERNET_IFACE=lan1
SSID=Mculover666
PASSPHRASE=12345678
USE_PSK=0
```

其中比较重要的配置：
- FREQ_BAND：热点频段
- WIFI_IFACE：无线网卡的设备节点
- INTERNET_IFACE：转发网卡的设备节点
- SSID：热点名称
- PASSPHRASE：热点密码

2. 开启热点
```shell
sudo create_ap --config /etc/create_ap.conf
```

开启日志如下：
```
Config dir: /tmp/create_ap.wlan0.conf.DPOzXpgH
PID: 2481
Network Manager found, set ap0 as unmanaged device... DONE
Creating a virtual WiFi interface... ap0 created.
Sharing Internet using method: nat
hostapd command-line interface: hostapd_cli -p /tmp/create_ap.wlan0.conf.DPOzXpgH/hostapd_ctrl
Configuration file: /tmp/create_ap.wlan0.conf.DPOzXpgH/hostapd.conf
Using interface ap0 with hwaddr 72:f7:54:86:d1:11 and ssid "Mculover666"
ap0: interface state UNINITIALIZED->ENABLED
ap0: AP-ENABLED 
```

3. 开机自启
```shell
systemctl enable create_ap
```