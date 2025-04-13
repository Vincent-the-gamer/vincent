---
title: 使用Balena Etcher烧录Windows系统启动U盘的一个坑
date: 2025-04-13
lang: zh
art: dots
---

# 前言

今天在给一台老Intel Nuc更新系统，由于原来安装了黑苹果双系统，现在不用了，而且Windows还是10，所以打算直接重装系统成11，并且把黑苹果格掉，但是我常用的是一台Mac电脑 ~~(家里有Windows电脑，但是我不在家)~~，于是就打算掏出我常用的`Balena Etcher`这款软件来烧录，因为macOS用不了`Rufus`。

# 坑来了

当我用`Etcher`准备烧录`Win 11`镜像的时候就发现不对劲了，`Etcher`报错说：

_看起来这不是一个可启动的镜像。这个镜像似乎不包含分区表，因此您的设备可能无法识别或无法正确启动。_

网上说忽略这个设置即可，但是事实证明确实**不可行**，安装程序里找不到驱动，因此无法正确安装系统。那么原因是什么捏？

# 原因

`Etcher`在写盘时会将U盘格式化成特殊的分区格式，然而Windows的安装本质上依赖于ISO镜像目录下的`install.wim`文件，而安装器能识别到了一个分区，然而又不支持读取这个分区格式，所以提示缺少驱动…

安装器提示缺少的并不是你要安装系统的硬盘的驱动，而是你U盘的分区格式的驱动。

所以如果在身边没有`Windows`电脑的情况下，要制作一个`Windows`的安装U盘，千万别用`Etcher`！

如果是macOS下，可以用[WinDiskWriter](https://github.com/TechUnRestricted/WinDiskWriter)来写盘。