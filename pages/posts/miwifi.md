---
title: 小米路由器Mesh组网 + ShellClash科学上网折腾记
date: 2025-2-4
lang: zh
plum: false
---

# 前言

前段时间白嫖了一台**小米路由器BE3600**，今天在尝试折腾ssh，为了装科学上网工具（你懂的）。然后因为家里本身有一个主网络，所以打算尝试以中继模式配合ShellClash实现家庭网络科学上网。


# 准备工作

需要准备的东西：
- 小米路由器 + 自带的网线 + 电源 ~~（废话）~~
- 另准备至少1根网线（**非必须**，看你是否有设备需要连接有线网络）
- 一台可以科学上网的电脑（用于配置路由器和ssh，同时方便访问GitHub等网站）

由于我的路由器是第一次使用，所以直接初始化即可，此处注意：<font color="red">尽量不要更新固件，不然可能得降级</font>

虽然我也升级了，不过好在没啥大问题，系统版本**1.0.65**实测可以免刷机打开ssh服务。

然后进行简单配置，保证路由器能上网即可。

# 打开SSH服务

注意，在进行以下操作前，请确保**你用来配置的设备所连接的网络和小米路由器是同一网络**。

## 第一步（选做）：降级固件

如果你使用的小米路由器**和我不是相同的型号**，那么你的系统版本可能**高于1.0.65**，此时可能需要降级，
旧版路由器固件由于型号太多，就没法贴了，自行搜索下载吧。

同时，降级需要一个[小米路由器降级工具](https://bigota.miwifi.com/xiaoqiang/tools/MIWIFIRepairTool.x86.zip)，
可能会被浏览器下载报告不安全，如果你实在无法信任所下载文件的安全性，可以考虑**在虚拟机里下载使用该工具**。

## 第二步：运行命令解锁SSH

Windows用户可使用`命令提示符(cmd)` 、macOS用户可使用`终端(Terminal)`，输入下列代码开启小米路由器BE3600的SSH功能:

```shell
# 请将 <STOK> 替换成 stok 码, stok码可以通过登录路由器后台管理页面，在浏览器URL中复制
# 注意：每次登录路由器后台 stok 码会改变。
curl -X POST http://192.168.31.1/cgi-bin/luci/;stok=<STOK>/api/misystem/arn_switch -d "open=1&model=1&level=%0Anvram%20set%20ssh_en%3D1%0A"

curl -X POST http://192.168.31.1/cgi-bin/luci/;stok=<STOK>/api/misystem/arn_switch -d "open=1&model=1&level=%0Anvram%20commit%0A"

curl -X POST http://192.168.31.1/cgi-bin/luci/;stok=<STOK>/api/misystem/arn_switch -d "open=1&model=1&level=%0Ased%20-i%20's%2Fchannel%3D.*%2Fchannel%3D%22debug%22%2Fg'%20%2Fetc%2Finit.d%2Fdropbear%0A"

curl -X POST http://192.168.31.1/cgi-bin/luci/;stok=<STOK>/api/misystem/arn_switch -d "open=1&model=1&level=%0A%2Fetc%2Finit.d%2Fdropbear%20start%0A"
```

## 第三步：ssh登录路由器，进行相关配置，并且修改默认密码

### 登录

使用以下命令登录:

```shell
ssh -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa root@192.168.31.1
```

- 默认用户名：root
- 默认密码：使用[密码计算网站](https://miwifi.dev/ssh)，将路由器的SN码复制进去计算密码，SN码可以在路由器机身或后台页面查看。

### 配置重启后自动开启SSH

```shell
nvram set ssh_en=1
nvram set telnet_en=1
nvram set uart_en=1
nvram set boot_wait=on
nvram commit
sed -i 's/channel=.*/channel="debug"/g' /etc/init.d/dropbear
/etc/init.d/dropbear restart
mkdir /data/auto_ssh && cd /data/auto_ssh
curl -O https://fastly.jsdelivr.net/gh/lemoeo/AX6S@main/auto_ssh.sh
chmod +x auto_ssh.sh
./auto_ssh.sh install
```

### 修改密码

运行以下命令修改root用户默认密码（Linux基操）

```shell
# 其实Linux修改root密码直接passwd就行，但是为了不出幺蛾子还是这样吧
passwd root
```

> [!WARNING]
> 此时会提示输入新密码，输入的内容**不会显示**，然后会提示二次确认密码，两次输入正确后密码修改成功。

## 第四步：固化SSH

> [!CAUTION]
> 注意，以下命令每一个reboot都会使路由器重启一次。

```shell
zz=$(dd if=/dev/zero bs=1 count=2 2>/dev/null) ; printf '\xA5\x5A%c%c' $zz $zz | mtd write - crash

reboot
```

此处等待路由器重启完毕，重新连接上路由器Wifi，再运行以下命令。

```shell
nvram set ssh_en=1
nvram set telnet_en=1
nvram set uart_en=1
nvram set boot_wait=on
nvram commit
bdata set ssh_en=1
bdata set telnet_en=1
bdata set uart_en=1
bdata set boot_wait=on
bdata commit

reboot
```

此处<font color="red" style="font-weight: bold;">继续</font>等待路由器重启完毕，重新连接上路由器Wifi，再运行以下命令。

```shell
mtd erase crash

reboot
```

执行指令后路由器会重启，重启后固化完成。

# Mesh组网 + ShellClash安装配置

未完待续，等我配好了再写。