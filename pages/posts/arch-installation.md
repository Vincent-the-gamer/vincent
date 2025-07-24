---
title: Arch Linux安装流程记录 (UEFI启动)
date: 2025-07-24
lang: zh
art: dots
---

# 前言

- 我的Arch安装在了一台Intel N100 CPU的迷你主机上，因为没有独显，我的安装流程里面没有**英伟达显卡驱动**的安装过程，如果需要安装，可以参考：[Arch安装Nvidia驱动的教程](https://ivonblog.com/posts/archlinux-install-nvidia-drivers/)，如果不符合您的要求，您也可以自己查阅资料。
- 我使用的是[`Hyprland`](https://wiki.hypr.land/Getting-Started/Installation/)图形化界面，如果您更喜欢其它界面，请无视我的`Hyprland`安装过程。

预览：~~原谅我没有截张预览图，只好用之前拍的屏了~~ 。

![arch-preview](/images/posts/arch-installation/arch-preview.jpg)

# 前置准备工作

## 下载镜像

Arch镜像下载：https://archlinux.org/download/

页面往下拉，找到China的镜像源部分下载就好。

![image-source](/images/posts/arch-installation/image-source.png)

镜像源网站中一般都有SHA256的txt文件，用来校验镜像文件完整性，如果你需要校验，可以运行以下命令:

```shell
certutil -hashfile 镜像文件.iso SHA256
```

如果SHA256与镜像源提供的一致，证明镜像文件没有被篡改过。

## 制作启动盘（Live CD）

> [!IMPORTANT] 重要
> 建议您在选择U盘时，找一个不常用来存数据的，在系统安装完成后，**不要格式化**，保留下Live CD启动盘，后续如果系统滚动更新挂了或者发生了其它问题，方便修复。

> [!CAUTION] 注意
> 如果您要安装Arch的电脑比较旧，不支持UEFI启动方式，制作启动盘时，分区类型得选MBR，并且<font color="red">**立即停止阅读**</font>该篇文章，立即转到：[Arch Linux (BIOS with MBR) 安装](https://shenyu.me/posts/arch-bios-install/)这篇文章，当然，如果您有更好的参考资料也可以自己去找，直到安装到**切换到安装好的Arch**这一步骤，即`arch-chroot /mnt`时，回到我的文章。

如果您 **「以UEFI启动方式安装」**，请继续参考我的文章。

- 如果您是`Windows`系统，推荐使用[`Rufus`](https://rufus.ie/zh/)工具来写入启动U盘。（点击“Rufus“即可跳转到官网哦～(∠・ω< )⌒☆）
- 如果您是`macOS`系统或`Linux`发行版，可以使用[`Balena Etcher`](https://etcher.balena.io/)等工具。_这里插一句，如果您要安装Windows系统，千万千万不能用Etcher写入镜像，具体原因看我另一篇文章：[使用Balena Etcher烧录Windows系统启动U盘的一个坑](./write-win-image-on-mac)_

> [!TIP] 温馨提示
> 在做以下步骤前，先把你的启动盘插上

## BIOS: 关闭Secure Boot(安全启动)

每个主板的BIOS可能不同，总之，就是在BIOS中找到`security(安全)`选项卡，找到`Secure Boot(安全启动，中文名称可能不同)`的选项，选择`disable(禁用)`的选项。

> [!NOTE] 大无语事件
> 一些少数主板，Secure Boot 被设置为开启，却不存在关闭它的选项，但系统主板内置有 Windows 系统的公钥证书签名，使其只能加载 Windows，其它系统（包括 archlinux）一律不予加载。用户不能关闭它，还没法换系统，实在让人无语。如果你正好是这样的电脑，emmm... 不妨在虚拟机里尝试下 archlinux 吧！

## BIOS: 调整启动方式为UEFI（选做）

在某些旧的主板里，需要调整启动模式为`UEFI`，而非传统的`BIOS/CSM`。在类似名为`boot`的选项卡中，找到类似名为`Boot Mode`的选项，确保将其调整为`UEFI only`，而非`legacy/CSM`。

## 调整硬盘启动顺序，保存BIOS设置

在类似名为`boot`的选项卡中，找到类似名为`Boot Options`（名称可能略有差异）的设置选项，将U盘的启动顺序调至首位。

然后保存BIOS设置并退出，此时电脑会重启

# 开始安装

在上述操作后，系统重启应该会自己进入Live CD了，此时应该会看到一个类似的黑框框：

![livecd-menu](/images/posts/arch-installation/livecd-menu.png)

选择`Arch Linux install medium (x86_64, UEFI)`即可，其它架构和启动模式类似。

然后正式进入Live CD

![arch-livecd](/images/posts/arch-installation/arch-livecd.png)

## 禁用reflector服务

2020年，archlinux安装镜像中加入了`reflector`服务，它会自己更新`mirrorlist`（软件包管理器 pacman 的软件源）。在特定情况下，它会误删某些有用的源信息。这里进入安装环境后的第一件事就是将其禁用。也许它是一个好用的工具，但是很明显，因为地理上造成的特殊网络环境，这项服务并不适合启用。

1. 禁用该服务
```shell
systemctl stop reflector.service
```

2. 查看该服务是否已经被禁用
```shell
systemctl status reflector.service
```

## 再次确认是否为UEFI模式

命令：
```shell
ls /sys/firmware/efi/efivars
```

若输出了一堆东西`（efi 变量）`，则说明已在`UEFI`模式。否则请确认你的启动方式是否为`UEFI`。

## 连接网络

> [!IMPORTANT] 重要
> Arch Linux的安装`必须`要求网络环境，使用您的其它电脑在局域网共享一个科学上网的代理端口更佳，可以通过终端命令：`export https_proxy=http://局域网IP:端口`来解决一些访问速度慢或无法访问（比如github抽风）的情况。

### 若使用无线网卡连接

> [!WARNING] 注意
> 1. 家里Wi-fi名称最好别是中文，因为命令行连不了（
> 2. 如果报错：Operation not possible due to RF-kill，请尝试：`rfkill unblock wifi`
> 3. 如果你的 BIOS 没有开启无线网卡的开关：
> ```shell
> rfkill list #查看无线连接 是否被禁用(blocked: yes)
> ip link set wlan0 up # 如果无线网卡是叫wlan0
> ```

使用`iwctl`连接：

```shell
iwctl # 进入交互式命令行
device list # 列出无线网卡设备名，比如无线网卡看到叫 wlan0
station wlan0 scan # 扫描网络
station wlan0 get-networks # 列出所有 wifi 网络
station wlan0 connect wifi-name # 进行连接，注意这里无法输入中文。回车后输入密码即可
exit # 连接成功后退出
```

### 若使用有线连接

一般来说，有线连接会自动通过DHCP分配一个IP，直接就能联网。

## 测试网络连通性

```shell
ping www.bilibili.com
```

稍等片刻，若能看到数据返回，即说明已经联网。与Windows不同的是，需要按下`Ctrl + C`手动退出ping命令。

## 更新系统时钟


未完待续。。。
