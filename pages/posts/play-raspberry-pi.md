---
title: 树莓派4B折腾记录
date: 2024-08-25
lang: zh
plum: true
---

# 烧录系统并启动

由于`armv7l`这一特殊架构，树莓派很多东西没法玩，而且我喜欢的Arch Linux也没有官方对armv7l的支持，虽然树莓派确实可以安装第三方构建的`Arch Linux Arm`，但是过程相对繁琐，还是直接用树莓派官方的`Raspberry Pi OS`, 烧录也很方便。

使用官方的烧录工具即可：[https://www.raspberrypi.com/software/](https://www.raspberrypi.com/software/)

下载系统时则选择：`Raspberry Pi OS with desktop and recommended software`

![os](/images/posts/raspberry-pi/os.png)

树莓派官方操作系统下载：[https://www.raspberrypi.com/software/operating-systems/](https://www.raspberrypi.com/software/operating-systems/)

注意烧录系统的时候打开SSH, VNC等服务，方便后续远程连接。

烧录完毕后，如果想要树莓派上电时自动连接wifi，就提前在sd卡boot目录下创建一个`wpa_supplicant.conf`文件

```
country=CN
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
 
network={
    ssid="wifi-name" # Wi-Fi名称，不要有中文
    psk="12345678"  # 密码
    priority=1 # 数字越大优先级越高
    scan_ssid=1 # 如果你的Wi-Fi是隐藏的，一定要加这个
}
```

> [!NOTE]
> 敲黑板划重点！这个是后面脱离显示器使用树莓派方法的关键步骤！

最后插入sd卡上电即可。

# 初始化操作系统

这里简述：

1. 设置国家，语言，时区
2. 设置用户名，密码
3. 设置屏幕
4. 连接wifi （如果配置了自动连接应该可以直接下一步）
5. 更新软件（可选）
6. 重启

至此初始化完毕。

# 树莓派软件源更换

众所周知的原因，官方源很慢，所以替换一下233

这里针对buster版本，如果你的树莓派系统是其它版本，把buster替换掉即可，如bookworm, bullseye

```shell
sudo nano /etc/apt/sources.list

> sources.list文件中
# 换为任意国内源即可，这里用清华源
deb http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main non-free contrib
deb-src http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main non-free contrib

sudo nano /etc/apt/sources.list.d/raspi.list

> raspi.list
deb http://mirrors.tuna.tsinghua.edu.cn/raspberrypi/ buster main ui

sudo apt-get update
```


# 配置SSH和远程连接（VNC或RDP）

## SSH

如果安装系统时没有配置SSH，可以现在配置：

![ssh1](/images/posts/raspberry-pi/ssh-1.png)
![ssh2](/images/posts/raspberry-pi/ssh-2.png)

然后查看局域网IP，通过IP连接即可
```shell
ifconfig
```

## 远程连接

树莓派开启的VNC Server版本过旧，我使用新版的客户端连接不上，所以我关闭了VNC，使用`xrdp`服务使用RDP连接。

```shell
sudo apt update && sudo apt upgrade # 更新软件源
sudo apt-get install xrdp
```

默认端口：3389，若要修改默认端口，编辑`/etc/xrdp/xrdp.ini`

# 安装Git

由于树莓派apt源无法安装最新版Git，故使用源码编译。

```shell
git clone https://github.com/git/git.git

cd git
make prefix=/usr/local all
sudo make prefix=/usr/local install
```

最后新开一个终端，检查是否正确安装
```shell
git --version
```

未完待续...
