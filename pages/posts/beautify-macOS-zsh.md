---
title: 美化macOS默认zsh终端
date: 2024-10-31
lang: zh
art: dots
---

# 前言

知周所众（）, macOS默认zsh终端一打开，就是一个白白的小窗口。

**尺寸: 行数x列数：80x24**
![shell-options](/images/posts/macos-zsh/default-zsh.png)

难看的一批，但是我又不想安装第三方shell客户端（如iTerm啥的），所以，就针对默认shell进行一个置的配<sup>（配置）</sup>。

# 美化步骤

## 第一步：进行窗口和字体的设置

打开终端，按下`command + ,`, 即可打开该设置页面。在这里，你可以针对窗口背景颜色，字体啥的进行一个简单的设置。

![shell-options](/images/posts/macos-zsh/shell-options.png)

推荐点击左下角`+号` 创建一个自己的配置, 如上图所示，`Vincent`是我添加的配置。 可以看到，可以自定义背景图片的。

但是，背景图片如果太花的话，字体容易看不清，建议用`Photoshop`给图片加个灰色蒙版啥的（）。

如果你不喜欢背景图片，推荐你把背景设置成黑色，然后半透明，这样很好看。

同时，还可以改窗口默认大小，字体，光标啥的，这里就不多说了，自己去研究去（）。

**PS:**

**2024-10-31：我现在用的就是纯黑色背景加半透明，本文[最下面](#我的配置效果)那个背景我不用了**

**当前背景效果:**

![black-bg](/images/posts/macos-zsh/zsh-black-bg.png)

## 第二步：修改`.zshrc`，开启终端CLI的配色

> [!CAUTION]
> 注意，如果你要安装Oh my zsh，则无需执行这一步!

默认终端的`主机名，用户名，当前路径, ls命令信息`等内容没有颜色高亮，通过以下配置，即可开启颜色高亮。

**PS: 懒得看的后面有总配置（）**

### 如何找到`.zshrc`?

在你的文件夹`用户/你的用户名`里面，使用`command + shift + .`即可显示隐藏文件`.zshrc`, 或者是,

```shell
vim ~/.zshrc
```

也行。

### 打开终端配色

```shell
export CLICOLOR=1 # 这是打开终端配色的意思
```

### 配置ls命令的颜色高亮

LSCOLORS配置项可以配置ls查找到的各种类型文件的高亮。

LSCOLORS=后面，共11组字母，每组2个字母，两个颜色。第一个字母为前景色，第二个字母为背景色。

```shell
export LSCOLORS=ExGxFxdaCxDaDahbadeche # 赋值号=后，2个字母为一组，共11组，每一组代表一种文件类型，而字母本身是颜色的意思
```

11组文件类型的意思如下（英文很简单，不过意思比汉语准确）

```
1. directory
2. symbolic link
3. socket
4. pipe
5. executable (可执行文件，x权限)
6. block special
7. character special
8. executable with setuid bit set (setuid=Set User ID，属主身份)
9. executable without setgid bit set
10. directory writable to others, with sticky bit
11. directory writable to others, without sticky bit
```

LSCOLORS中，各个字母代表的颜色如下，注意大小写是有区别的：

```
a 黑色
b 红色 	 代表压缩文件或者压缩包
c 绿色	 代表可执行文件
d 棕色        代表块文件
e 蓝色 	 代表目录
f 洋红色
g 青色 	 代表链接
h 浅灰色
A 黑色粗体
B 红色粗体
C 绿色粗体
D 棕色粗体
E 蓝色粗体
F 洋红色粗体
G 青色粗体
H 浅灰色粗体
x 系统默认颜色
```

### 配置用户名颜色，主机名颜色、路径颜色高亮

**以下颜色均可以根据规则自己选择。**

#### zsh下：

```shell
autoload -U colors && colors
PROMPT="%{$fg_bold[cyan]%}%n%{$reset_color%}@%{$fg_bold[cyan]%}%m %{$fg_bold[blue]%}%1~ %{$reset_color%}%# "
```

$fg正常字体，$fg_bold：粗体，颜色深一些。[ ]里的就是颜色

颜色:

```
黑: black 或 0
红: red 或 1
绿: green 或 2
⻩: yellow 或 3
蓝: blue 或 4
紫: magenta 或 5
⻘: cyan 或 6
白: white 或 7
```

#### 补充: 如果你用bash，则这样配置颜色

```shell
export PS1='\[\033[01;36m\]\u@\h\[\033[01;32m\] \W\$\[\033[00m\] '
```

```
颜色：
默认 : \e[00m
黑色 : \e[01;30m
红色 : \e[01;31m
绿色 : \e[01;32m
黄色 : \e[01;33m
蓝色 : \e[01;34m
洋红 : \e[01;35m
青色 : \e[01;36m
白色 : \e[01;37m

意义：
[ ]这个方括号是自己加的无意义符号
\u表示用户
@表示@
\h表示host
:也是个无意义符号
\w表示当前目录
\$表示命令提示符
```

### 总配置

**以下颜色均可以根据规则自己选择。**

#### zsh

```shell
# 打开终端配色
export CLICOLOR=1 # 这是打开终端配色的意思
export LSCOLORS=ExGxFxdaCxDaDahbadeche # 赋值号=后，2个字母为一组，共11组，每一组代表一种文件类型，而字母本身是颜色的意思
autoload -U colors && colors
PROMPT="%{$fg_bold[cyan]%}%n%{$reset_color%}@%{$fg_bold[cyan]%}%m %{$fg_bold[blue]%}%1~ %{$reset_color%}%# "
```

#### bash

```shell
export CLICOLOR=1 # 这是打开终端配色的意思
export LSCOLORS=ExGxFxdaCxDaDahbadeche # 赋值号=后，2个字母为一组，共11组，每一组代表一种文件类型，而字母本身是颜色的意思
export PS1='\[\033[01;36m\]\u@\h\[\033[01;32m\] \W\$\[\033[00m\] '
```

# 我的配置效果

![my-zsh](/images/posts/macos-zsh/my-zsh.png)
