---
title: 使用ssh config文件来配置和管理ssh连接
date: 2025-03-26
lang: zh
plum: false
---

# 配置文件

ssh程序可以从以下途径获取配置参数：

> [!NOTE] 笔记
> `~`在shell中一般表示用户文件夹，即：
>
> Windows: `C:/Users/<你的用户名>`
>
> macOS: `/Users/<你的用户名>`
>
> Linux: `/home/<你的用户名>`

- 命令行选项
- 用户配置文件 (`~/.ssh/config`)
- 系统配置文件 (`/etc/ssh/ssh_config`)

配置文件可分为多个配置区段，每个配置区段使用`Host`来区分。我们可以在命令行中输入不同的`host`来加载不同的配置段。

对每一个配置项来说，首次获取的参数值将被采用，因此通用的设置应该放到文件的后面，特定`host`相关的配置项应放到文件的前面。

# 常用配置项

## Host

`Host`配置项标识了一个配置区段。

ssh配置项参数值可以使用通配符：**`*`代表0～n个非空白字符，`?`代表一个非空白字符，`!`表示例外通配(取非)。**

我们可以在系统配置文件中看到一个匹配所有host的默认配置区段：

```shell
# 这个是系统配置，用户配置为~/.ssh/config
$ cat /etc/ssh/ssh_config | grep '^Host'
Host *
```
这里有一些默认配置项，我们可以在用户配置文件中覆盖这些默认配置。

## GlobalKnownHostsFile
指定一个或多个全局认证主机缓存文件，用来缓存通过认证的远程主机的密钥，多个文件用空格分隔。

`Linux/macOS`默认缓存文件为：

- `/etc/ssh/ssh_known_hosts`
- `/etc/ssh/ssh_known_hosts2`

`Windows`有所区别，具体取决于你安装的ssh所在目录。

## HostName
指定远程主机名，可以直接使用数字IP地址。如果主机名中包含 ‘%h’ ，则实际使用时会被命令行中的主机名替换。

## IdentityFile
指定密钥认证使用的私钥文件路径。默认为以下文件的其中一个:

- `~/.ssh/id_dsa`
- `~/.ssh/id_ecdsa`
- `~/.ssh/id_ed25519`
- `~/.ssh/id_rsa`
 
文件名称可以使用以下转义符：

```
'%d' 本地用户目录
'%u' 本地用户名称
'%l' 本地主机名
'%h' 远程主机名
'%r' 远程用户名
```

可以指定多个密钥文件，在连接的过程中会依次尝试这些密钥文件。

## Port

指定远程主机端口号，默认为 `22` 。

## User
指定登录用户名。

## UserKnownHostsFile

指定一个或多个用户认证主机缓存文件，用来缓存通过认证的远程主机的密钥，多个文件用空格分隔。

默认缓存文件为：

- `~/.ssh/known_hosts`
- `~/.ssh/known_hosts2`

# 使用配置文件登录

假设你的配置文件为：

```
Host ciallo
    HostName mako.ciallo.yuzu
    User mako
    Port 2222
    IdentityFile ~/.ssh/id_rsa

Host wow
    HostName dadebucuo.net
    User priest
    Port 22
```

你就可以选择使用指定配置文件登录：

```shell
ssh ciallo
```