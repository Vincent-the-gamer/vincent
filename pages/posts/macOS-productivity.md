---
title: 一个程序员的macOS生产力工具推荐
date: 2024-11-09
lang: zh
art: dots
---

# Raycast

> [!NOTE]
> 虽然Raycast有会员机制，但是你不需要开会员也能使用它的大部分功能，它的插件都是社区开源插件。

官网：[https://www.raycast.com/](https://www.raycast.com/)

Raycast是一款加强版的聚焦搜索软件，它有很多加强功能：

- 它可以保存你的剪贴板历史(自带功能)
- 你可以用它搜索github仓库，并直接打开对应的仓库页面
- 用它发起http请求
- 快速检索你电脑中的文件
- 快速打开软件
- ...

在插件的支持下，你几乎可以用它当作你一切的快捷方式，
正如官方的那句宣传语：`Your shortcut to everything`.

Raycast 甚至可以自己开发插件。~~(虽然官方对插件的审核比较严格就是了)~~

## 使用

默认使用`Option + 空格`唤醒Raycast窗口, Raycast平时会隐藏在你的任务栏中。
它的快捷键是可以自行配置的，具体使用方法推荐自己下载研究。

例如：我这里打开的是`cURL`插件，是的，你可以用它来`发起一个HTTP请求`。

![raycast-1](/images/posts/mac-productivity/raycast-1.png)

其它功能你可以搜索Store, 在里面寻找需要安装的插件即可。

![raycast-2](/images/posts/mac-productivity/raycast-2.png)

关于插件的使用教程，一般插件的安装页都会有说明。

~~啊？你问我为什么不用UTools? 因为我不喜欢广告~~

<div pt-10 />

# Homebrew

官网：[https://brew.sh/](https://brew.sh/)

Homebrew是一个包管理器，可以安装一些开发者使用的shell工具库，例如`git`，由于苹果提供的自带git不是最新版，
我们想要安装最新版，最方便的就是借助包管理器。

当然，如果你会使用`nix`，也可以使用这个，但是nix对包的管理机制是另外在系统根目录中创建一个文件夹，
然后把所有由nix安装的包统一管理，所以按照你的个人喜好选择`homebrew`或者`nix`就好。

## 安装Homebrew

如果你的网络环境可以访问谷歌，那么你可以使用官方脚本安装。

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

否则，推荐你使用我的安装脚本，使用国内源进行安装，并且自动配置镜像仓库为国内源。

[https://github.com/Vincent-the-gamer/homebrew-install](https://github.com/Vincent-the-gamer/homebrew-install)

## 使用Homebrew

首先更新brew版本

```shell
brew update
```

然后安装你需要的工具即可，比如安装`git`

```shell
brew install git
```

如果你要升级工具，还是以`git`为例，使用

```shell
brew upgrade git
```

<div pt-10 />

# macOS终端美化

请看我的另外一篇博客：[美化macOS默认zsh终端](/posts/beautify-macOS-zsh)

<div pt-10 />

# Oh my zsh

官网：[https://ohmyz.sh/](https://ohmyz.sh/)

GitHub: [https://github.com/ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh)

> [!NOTE]
> 注意，安装Oh my zsh前需要安装Git

Oh my zsh是对`zsh`的加强配置，其中包含了主题和插件，zsh同时支持`macOS`和`Linux`。
它是`macOS`的默认终端，但是在`Linux`下，你需要单独安装。

如图：

![zsh-1](/images/posts/mac-productivity/oh-my-zsh-1.png)

我的zsh配置了插件，可以读取zsh_history，敲过的命令可以自动联想出来，此时按下键盘的方向右键，即可补全命令。

同时，我的主题还能显示`当前文件夹名字`，`当前git分支`，`Node.js版本`等信息。

这些功能和主题都可以从社区下载，如果你想要我的配置，可以从这里获取：

[我的.zshrc配置](https://github.com/Vincent-the-gamer/dotfiles/blob/main/zsh/.zshrc-oh-my-zsh)

<div pt-10 />

# Kap

Kap是一款能够录制GIF动图的软件，通过录屏，可以导出GIF, MP4, WebM, APNG格式

官网：[https://getkap.co/](https://getkap.co/)

![kap](/images/posts/mac-productivity/kap.png)

# Command X

找回你macOS上的“剪切”功能，安装了这个工具后，你就可以使用`Command + X`剪切文件，然后粘贴到其它地方去了。

下载：直接在App Store搜索`Command X`即可

![command-x](/images/posts/mac-productivity/command-x.png)

<div pt-10 />

# 未完待续

后续有新工具也会补充到这里
