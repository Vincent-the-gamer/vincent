---
title: Krkr2模拟器的注意事项
date: 2025-05-07
lang: zh
art: dots
---

# 前言

最近为了学移动端开发整了个最便宜的红米手机，顺便物尽其用，把啥`termux`之类的东西也装上玩玩，所以就想，干脆也玩玩街机和旮旯Game算了。

安卓端的Galgame比较杂，有apk直装的，也有各种不同模拟器的资源，可以在[Touchgal](https://www.touchgal.io/)找资源。

以我下载的柚子社游戏`Riddle Joker`为例，我的这个资源是[Krkr2模拟器](https://github.com/2468785842/krkr2)的，所以就下载对应模拟器来运行。

# 坑

Krkr模拟器默认状态下有个白边，导致Galgame的底部菜单被挡住了 ~~(生草)~~，长这样式的：

![baibian](/images/posts/galgame/baibian.jpg)

所以，需要在**全局设置**里勾选一个选项：

![quanju](/images/posts/galgame/quanju.jpg)

勾选：`隐藏系统键（需重启软件）` 这一个选项：

![xitong](/images/posts/galgame/xitong.jpg)

然后重启Krkr2模拟器即可，可以看到底部白边没了，菜单正常显示，也可以正常点击。

![zhengchang](/images/posts/galgame/zhengchang.jpg)

