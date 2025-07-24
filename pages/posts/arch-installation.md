---
title: Arch Linux安装流程记录 (UEFI启动 + Hyprland桌面)
date: 2025-07-24
lang: zh
art: dots
---

# 前言

- 我的安装过程一部分参考了：https://arch.icekylin.online/guide/ 这篇文章
- 我的Arch安装在了一台Intel N100 CPU的迷你主机上，因为没有独显，我的安装流程里面没有**英伟达显卡驱动**的安装过程，如果需要安装，可以参考：[Arch安装Nvidia驱动的教程](https://ivonblog.com/posts/archlinux-install-nvidia-drivers/)，如果不符合您的要求，您也可以自己查阅资料。
- 我使用的是[`Hyprland`](https://wiki.hypr.land/Getting-Started/Installation/)图形化界面，如果您更喜欢其它界面，请无视我的`Hyprland`安装过程。
- 我是在单硬盘安装**Arch Linux单系统**，如果您需要安装**Arch + Windows双系统**，请在分区这个环节，查看：[这篇文章](https://arch.icekylin.online/guide/rookie/basic-install.html#_7-%E5%88%86%E5%8C%BA%E5%92%8C%E6%A0%BC%E5%BC%8F%E5%8C%96-%E4%BD%BF%E7%94%A8-btrfs-%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F)

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
> 如果您要安装Arch的电脑比较旧，不支持UEFI启动方式，制作启动盘时，分区类型得选MBR，并且<font color="red">**立即停止阅读**</font>该篇文章，立即转到：[Arch Linux (BIOS with MBR) 安装](https://shenyu.me/posts/arch-bios-install/)这篇文章，当然，如果您有更好的参考资料也可以自己去找，直到安装到[**切换到安装好的Arch**](#切换到安装好的arch-linux)这一步骤，即`arch-chroot /mnt`时，回到我的文章。

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

# Arch Linux基础安装

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
> Arch Linux的安装`必须`要求网络环境，最好能使用您的其它电脑在局域网共享一个科学上网的代理端口，然后通过终端命令：`export https_proxy=http://局域网IP:端口`走代理解决一些访问速度慢或无法访问（比如github抽风）的情况。

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

使用`timedatectl`确保系统时间是准确的。正确的系统时间对于部分程序来说非常重要：

```shell
timedatectl set-ntp true # 将系统时间与网络时间进行同步
timedatectl status # 检查服务状态
```

## pacman换国内源，加快下载速度

> [!CAUTION] 注意
> 请不在这一步中添加`archlinuxcn`源！如果你在`/etc/pacman.conf`中添加了内容，请将它们删掉。

使用`vim`编辑器修改`/etc/pacman.d/mirrorlist`文件。将`pacman`软件仓库源更换为国内软件仓库镜像源：

```shell
vim /etc/pacman.d/mirrorlist
```

放在最上面的是会使用的软件仓库镜像源，推荐的镜像源如下：

```
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch # 中国科学技术大学开源镜像站
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch # 清华大学开源软件镜像站
Server = https://repo.huaweicloud.com/archlinux/$repo/os/$arch # 华为开源镜像站
Server = http://mirror.lzu.edu.cn/archlinux/$repo/os/$arch # 兰州大学开源镜像站
```

![pacman-mirrorlist](/images/posts/arch-installation/pacman-mirrorlist.png)

## 分区和格式化（btrfs文件系统，单硬盘，单系统）

使用`lsblk`查看当前分区情况，注意看清楚你的主硬盘符号！！！可以根据存储空间等信息来判断。

### 删除原来的硬盘分区
如果您的硬盘之前有分过区，并且想要需要删除分区并且重新分区的话，可以通过: `fdisk /dev/sdX`(sdX是你的盘符)来重写分区表，进去以后连续运行`d`命令删除每个分区，然后使用`w`重写分区表，则可以得到未分区的完整储存空间

### 我的硬盘分区规划
- `/boot`: EFI分区，`512MB`
- Swap 分区: `9G` (我小主机内存16G，原则上应该取>=60%，9.6G，但我这里就向下取整了。。)
- `/`: 根目录，使用剩下所有空间

### 开始分区

使用`cfdisk`命令对磁盘分区：

对于SATA协议：
```shell
cfdisk /dev/sdx # x是字母 a,b,c等
```

对于NVME协议：
```shell
cfdisk /dev/nvmexn1 # x是数字0, 1, 2等
```

进入`cfdisk`分区工具之后，你会看到如图所示的界面。~~（此图片仅供参考，一切内容以你自己的电脑为准）~~ 通过方向键`↑`和`↓`可以在要操作磁盘分区或空余空间中移动；通过方向键 ← 和 → 在对当前高亮的磁盘分区或空余空间要执行的操作中移动。

![cfdisk](/images/posts/arch-installation/cfdisk.png)

重点是下面菜单！！！看清楚了我们就开始分区。

假设我们要安装的硬盘是/dev/sda, 那么

首先创建EFI分区：

选中`Free space` > 再选中操作`[New]`，然后按下回车`Enter`以新建一个分区。
按下回车后会提示输入分区大小，EFI分区为`512MB`，输入：`512MB`，然后按下回车`Enter`

默认新建的类型是`Linux filesystem`，我们需要将类型更改为`EFI System`。选中操作`[Type]`，然后按下回车`Enter`, 通过方向键`↑` 和`↓` 选中`EFI System`，最后按下回车`Enter`

![partition-type](/images/posts/arch-installation/partition-type.png)

Swap分区类似，然后最后再创建主分区，注意主分区最后创建！！因为要使用剩下的所有空间！主分区就不用修改类型了，也就是保持`Linux filesystem`


## 挂载硬盘

注意挂载是有顺序的，需要从根目录开始挂载。

这里以SATA为例，NVME不再赘述。

按照我之前的分区规划:
- /dev/sda1作为EFI分区(/boot)
- /dev/sda2作为Swap分区
- /dev/sda3作为主分区

实际情况根据你自己的规划调整。

```shell
mount -t btrfs -o subvol=/@,compress=zstd /dev/sda3 /mnt # 挂载 / 目录
mkdir -p /mnt/boot # 创建 /boot 目录
mount /dev/sda1 /mnt/boot # 挂载 /boot 目录
swapon /dev/sda2 # 挂载交换分区
```

使用 `df -h` 命令可以复查挂载情况，使用`free -h`命令可以复查Swap分区挂载情况。

## 安装系统

通过`pacstrap`脚本安装基础包

```shell
# 如果使用btrfs文件系统，额外安装一个btrfs-progs包
pacstrap /mnt base base-devel linux linux-firmware btrfs-progs
```

如果提示GPG证书错误，可能是因为使用的不是最新的镜像文件，可以通过更新`archlinux-keyring`解决此问题:
```shell
pacman -S archlinux-keyring
```

此外，安装一些必要的功能性软件
```shell
# 如果您喜欢zsh，不想用fish，安装zsh zsh-completions，当然，您也可以用bash。
pacstrap /mnt networkmanager vim sudo fish
```

## 生成fstab文件
`fstab`用来定义磁盘分区。它是Linux系统中重要的文件之一。使用`genfstab`自动根据当前挂载情况生成并写入fstab文件：

```shell
genfstab -U /mnt > /mnt/etc/fstab
```

复查`/mnt/etc/fstab`确保没有错误：
```shell
cat /mnt/etc/fstab
```

## 切换到安装好的Arch Linux

使用以下命令把系统切换到新系统下：

```shell
arch-chroot /mnt
```

此时，原来安装盘下的`/mnt`目录就变成了新系统的`/`目录。同时，可以发现命令行的提示符颜色和样式也发生了改变。

> [!CAUTION] 注意
> 现在系统还没有安装完毕！！请勿重启！！

## 设置主机名与时区
1. 首先在`/etc/hostname`设置主机名, 取一个自己喜欢的名字就好，比如：arch

> [!TIP] 提示
> 主机名不要包含特殊字符及空格

```shell
vim /etc/hostname
```

2. 配置hosts，在`/etc/hosts`设置与其匹配的条目：
```shell
vim /etc/hosts
```

加入如下内容，注意对齐：

> [!TIP] 提示
> `xx.localdomain xx`中的xx要与你前面在`/etc/hostname`中设置的一致

```
127.0.0.1   localhost
::1         localhost
127.0.1.1   arch.localdomain arch
```

3. 设置时区：

列出所有时区：
```shell
ls /usr/share/zoneinfo
```

设置：在`/etc/localtime`下用`/usr`中合适的时区创建符号链接：

```shell
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

## 硬件时间设置
使用如下命令将系统时间同步到硬件时间：

```shell
hwclock --systohc
```

## 设置Locale
`Locale`决定了软件使用的语言、书写习惯和字符集。

1. 编辑`/etc/locale.gen`，去掉`en_US.UTF-8 UTF-8`以及`zh_CN.UTF-8 UTF-8`行前的注释符号（`#`）：

![locale](/images/posts/arch-installation/locale.png)
![locale-2](/images/posts/arch-installation/locale-2.png)

2. 生成locale
```shell
locale-gen
```

3. 向`/etc/locale.conf`输入内容：

> [!CAUTION]
> 不推荐在此设置任何中文`locale`，会导致`tty`乱码。

```shell
echo 'LANG=en_US.UTF-8' > /etc/locale.conf
```

## 为root用户设置密码
```shell
passwd root
```

## 安装微码

什么是微码？可以看看Arch Linux官方文档是咋解释的：https://wiki.archlinuxcn.org/wiki/%E5%BE%AE%E7%A0%81

通过以下命令安装对应芯片制造商的微码：

```shell
pacman -S intel-ucode # Intel
pacman -S amd-ucode # AMD
```

## 安装引导程序

1. 安装以下包：
```shell
pacman -S grub efibootmgr
```

- `grub` —— 启动引导器
- `efibootmgr` —— efibootmgr 被 grub 脚本用来将启动项写入 NVRAM

此外，`os-prober`包可以用于引导其它操作系统，如果是安装多系统的可以安装

2. 安装GRUB到EFI分区
```shell
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=ARCH
```

说明：
- --efi-directory=/boot —— 将 grubx64.efi 安装到之前的指定位置（EFI 分区）
- --bootloader-id=ARCH —— 取名为 ARCH

3.接下来使用 vim 编辑`/etc/default/grub`文件：
```shell
vim /etc/default/grub
```

进行如下修改：
- 去掉`GRUB_CMDLINE_LINUX_DEFAULT`一行中最后的`quiet`参数
- 把`loglevel`的数值从`3`改成`5`。这样是为了后续如果出现系统错误，方便排错
- 加入`nowatchdog`参数，这可以显著提高开关机速度

PS: `nowatchdog`参数无法禁用英特尔的看门狗硬件，改为`modprobe.blacklist=iTCO_wdt`即可。

![grub-config](/images/posts/arch-installation/grub-config.png)

如果你安装了`os-prober`，则需要添加一行：`GRUB_DISABLE_OS_PROBER=false`
```shell
# GRUB boot loader configuration

GRUB_DEFAULT=0
GRUB_TIMEOUT=5
GRUB_DISTRIBUTOR="Arch"
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=5 nowatchdog"
GRUB_CMDLINE_LINUX=""
GRUB_DISABLE_OS_PROBER=false # 这里
...
```

> [!TIP] 提示
> 1. 在某些主板安装完成后，你会发现没有启动条目。这是因为某些主板的 UEFI 固件在显示 UEFI NVRAM 引导条目之前，需要在特定的位置存放可引导文件，不支持自定义存放 efi 文件。解决方案是在默认启动路径下安装 GRUB。重新插入安装U盘，按原先顺序挂载目录（不需要再次创建文件夹了），chroot 到 /mnt，然后你可以重新用 --removable 安装grub2，如下命令所示。只有安装完成后你的主板不出现启动条目才需要尝试如下命令，正常安装无需执行。可以参考[ArchWiki](https://wiki.archlinuxcn.org/wiki/GRUB#%E7%BC%BA%E7%9C%81/%E5%90%8E%E5%A4%87%E5%90%AF%E5%8A%A8%E8%B7%AF%E5%BE%84)
> ```shell
>   grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=ARCH --removable
> ```
>
> 2.`os-prober`在chroot环境中可能无法正常运作。如果遇到这种情况，重启并引导进入系统后再次尝试生成配置文件。

## 完成安装
输入：
```shell
exit # 退回安装环境
umount -R /mnt # 卸载新分区
reboot # 重启
```

重启后进入BIOS，把启动顺序改一下，让新安装的引导排第一个，然后保存BIOS设置，等电脑重启时拔掉U盘即可。

进入GRUB界面：

![grub](/images/posts/arch-installation/grub.png)

使用root用户登录：
![login](/images/posts/arch-installation/login.png)

设置开机自动联网：
```shell
systemctl enable --now NetworkManager # 设置开机自启并立即启动 NetworkManager 服务
ping www.bilibili.com # 测试网络连接
```

若为无线连接，则需要在启动`networkmanager`后使用`nmcli`连接网络：
```shell
nmcli dev wifi list # 显示附近的 Wi-Fi 网络
nmcli dev wifi connect "Wi-Fi名（SSID）" password "网络密码" # 连接指定的无线网络
```

也可以用`nmtui`配置网络:
```shell
nmtui
```

至此，一个基础的无图形界面的Arch Linux就安装完毕了。

接下来我们还需要一些后续配置，才能安装图形化界面，比如普通用户，AUR助手。

# 后续配置

## 创建一个普通用户

1. 创建用户

> [!WARNING] 注意
> 用户名不要用中文，大写，否则Hyprland会登不进去。

```shell
# 不指定默认终端
useradd -m "username"

# 指定默认终端为fish: -s "/bin/fish"
useradd -m -s "/bin/fish" "username"
```

2. 给用户设置一个密码
```shell
passwd username
```

3. 把用户添加进`/etc/sudoers`的wheel组
```shell
usermod -a -G wheel username
```

4. 修改`/etc/sudoers`文件，找到这样一行：
```shell
# %wheel ALL=(ALL) ALL
```

将%wheel前面的#注释去掉即可

## 配置archlinuxcn
这里使用清华的软件源，在`/etc/pacman.conf`末尾添加以下内容：
```toml
[archlinuxcn]
SigLevel = Optional TrustAll
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
```

设置在本地信任 farseerfc 的 GPG key：
```shell
sudo pacman-key --lsign-key "farseerfc@archlinux.org"
```

然后安装archlinuxcn密钥：
```shell
sudo pacman -Sy archlinuxcn-keyring

# 整体更新下
sudo pacman -Syyu
```

## 安装yay (或者其它AUR助手)

如果配置了archlinuxcn，就可以直接用pacman安装yay了。
```shell
sudo pacman -Sy yay
```

什么是AUR？看这里：[Arch用户软件仓库](https://wiki.archlinuxcn.org/wiki/Arch_%E7%94%A8%E6%88%B7%E8%BD%AF%E4%BB%B6%E4%BB%93%E5%BA%93)

至此，就可以开始安装图形操作界面了

> [!TIP] 提示
> 记住，这里还没有修改locale为中文，我后面因为安装了懒人包就没有单独安装中文字体，请务必在修改中文locale前安装好中文字体！
>
> 如果要修改locale，查看：[修改系统locale](#修改系统locale)
>
> 如果你要安装图形界面，推荐安装好后，再在里面去安装中文字体，最后修改locale, 如果你不安装图形界面，那么就直接安装中文字体，然后修改locale。

# 安装Hyprland

1. 安装基础Hyprland
```shell
# waybar是系统状态栏，hyprpaper是用于设置壁纸的
sudo pacman -S hyprland waybar hyprpaper
```

然后我们通过运行以下命令，进入预览的图形界面，这一步非常重要，因为我们后续要安装一个懒人包，省去所有配置：
```shell
Hyprland
```

2. 安装懒人配置包

推荐的懒人包是：[dots-hyprland](https://github.com/end-4/dots-hyprland)

当我们进入预览图形界面后，通过默认快捷键`Win + Q`打开`kitty`终端，然后输入dots-hyprland的安装命令：
```shell
# 如果提示fish/zsh无法运行该命令，先把终端临时切到bash：先输入bash回车，然后再运行以下命令
bash <(curl -s "https://end-4.github.io/dots-hyprland-wiki/setup.sh")
```

一路跟着输密码和确认，这个过程还是比较考验耐心的哈哈哈

等待脚本跑完，你就得到了别人提前折腾好的一套Hyprland配置，不得不说，这套UI还有动效我挺喜欢的。

# 安装sddm，设置开机自启

此时，你的电脑还不会自动进入图形界面，需要安装sddm并配置开机自启来进入图形化登录界面

```shell
sudo pacman -Sy sddm
sudo systemctl enable --now sddm
```

# 修改系统locale
之前的locale还是英文，我们需要修改一下：
```shell
sudo localectl set-locale LANG=zh_CN.utf8
```

# 重启电脑，开始享受Arch Linux + Hyprland

重启电脑，如果没有问题，应该会自动进入sddm的登录界面，登录后就可以进入Hyprland啦～