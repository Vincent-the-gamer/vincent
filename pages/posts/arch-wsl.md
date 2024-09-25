---
title: 如何使用ArchWSL来快速为WSL安装Arch Linux系统
date: 2024-09-20
lang: zh
plum: true
---

# WSL是个啥？

WSL: Windows Subsystem for Linux (适用于 Linux 的 Windows 子系统)

通过它可以直接在 Windows 上运行 Linux 文件系统以及 Linux 命令行工具和 GUI 应用，并可以运行传统的 Windows 桌面和应用。

# 如何使用WSL

## 在控制面板中打开Linux子系统功能

1.打开控制面板，把图标调成小，然后找到“程序和功能”。

2.打开“启用或关闭Windows功能”，滚动列表，找到“适用于 Linux 的 Windows 子系统”并勾选。

![wsl](/images/posts/archwsl/wsl1.png)

这会安装并默认指定wsl1版本

## 将默认WSL版本设置为2

使用powershell

```shell
# 更新wsl
wsl --update
# 将默认版本设置为2
wsl --set-default-version 2
```

# 在WSL2安装Arch Linux

## 下载并自动安装ArchWSL

从GitHub仓库：[yuk7/ArchWSL](https://github.com/yuk7/ArchWSL) 的Release中下载Arch.zip

然后解压到你要存放的目录，运行Arch.exe即可自动给你的wsl2中安装上Arch Linux。

## 修改wsl默认启用的发行版

查看当前wsl安装了的发行版

```shell
wsl --list
```

设置wsl默认发行版

```shell
wsl --set-default Arch
```

## 从终端进入Arch Linux

```shell
wsl
```

## 初始化Arch Linux

注意，默认进入系统的root用户名为你Windows用户文件夹的用户名，无密码

### 为root用户设置密码

输入密码时不会在终端显示，请知悉。

```shell
passwd
```

### 添加新用户, 设置新用户密码

设置`sudoers`文件

```shell
echo "%wheel ALL=(ALL) ALL" > /etc/sudoers.d/wheel
```

将新用户添加至wheel组，为后续使用sudo做准备

`{username}`是你要指定的用户名，随便取个名就行

```shell
useradd -m -G wheel -s /bin/bash {username}
```

设置新用户密码：

```shell
passwd {username}
```

### 退出Arch, 指定启用Arch时的默认用户为你的新用户

为了安全性不建议默认使用root

上述步骤密码设置完成后执行 exit 退出 Arch，在 Windows 的命令行内执行以下命令来设置默认用户：

```shell
# Arch.exe的路径根据实际情况指定
Arch.exe config --default-user {username}
```

### 输入wsl重新进入Arch，开始初始化

1. 配置国内源

由于众所周知的原因，Arch官方源访问速度堪忧，所以配置国内源

ArchWSL默认封装了vim/nano，不必担心无法修改配置文件

```shell
sudo vim /etc/pacman.d/mirrorlist
```

找到China的部分，把想要使用的源解除注释即可，例如中国科学技术大学（中科大）源

```shell
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

保存退出。

2. 初始化密钥环 (Keyring)

```shell
sudo pacman-key --init
sudo pacman-key --populate
sudo pacman -Syy archlinux-keyring
# 更新系统
sudo pacman -Syyu
```

3. 添加Arch linux CN源，为使用AUR做准备

```shell
sudo vim /etc/pacman.conf
```

在文件后面加入

```toml
# 中科大源
[archlinuxcn]
# 如果安装某些包报签名问题，可以设置为TrustAll试试
SigLevel = Optional TrustedOnly
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
```

其中，SigLevel设置的是软件源的前面等级，取值范围如下：

- TrustedOnly：如果检查了签名，则该签名必须位于密钥环中并且完全受信任； 边际信任不符合此条件；
- TrustAll：如果检查了签名，则签名必须在密钥环中，但不需要分配信任级别（例如，未知或边际信任）
- Never：表示不进行签名检查
- Optional：表示将检查签名（如果存在），但也将接受未签名的数据库和软件包。
- Required：则所有软件包和数据库都需要签名。

默认为Optional TrustedOnly

然后重新同步数据库，并且安装archlinuxcn-keyring

```shell
sudo pacman -Syy
sudo pacman -S archlinuxcn-keyring
```

4. 安装AUR助手

推荐`paru`或`yay`，二选一即可

```shell
sudo pacman -S paru
# 或
sudo pacman -S yay
```

5，安装必要组件

```shell
sudo pacman -Sy --needed base-devel git
```

至此初始化完毕

### 安装其它软件

- zsh + oh-my-zsh: 使用zsh终端加上终端美化可以更爽

```shell
sudo pacman -S zsh

# 切换默认终端为zsh
chsh -s /usr/bin/zsh

# 安装oh-my-zsh
sh -c "$(curl -fsSL https://install.ohmyz.sh/)"
```

配置oh-my-zsh可以参考我的dotfiles: [Vincent-the-gamer/dotfiles](https://github.com/Vincent-the-gamer/dotfiles)

- fastfetch: neofetch的平替，可以查看系统信息(neofetch仓库已archive，不再维护了)

```shell
sudo pacman -Sy fastfetch
```

- 网络工具: 默认没有提供ifconfig等命令，需要安装

```shell
sudo pacman -S net-tools dnsutils inetutils iproute2 wireless_tools
```

其它的结合实际需要安装吧。
