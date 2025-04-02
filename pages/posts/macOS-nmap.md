---
title: 在macOS上安装/卸载nmap网络扫描工具
date: 2024-08-24
lang: zh
art: dots
---

# 安装

下载安装macOS `.dmg`:

[https://nmap.org/download.html](https://nmap.org/download.html)

客户端有些问题，不能直接打开，需要使用终端

```shell
open -a zenmap
```

才能打开Zenmap GUI

# 卸载

`nmap.dmg`安装的内容：

- /Applications/Zenmap.app --- Zenmap GUI
- /usr/local/bin 中的二进制文件
- /usr/local 中的依赖

卸载命令：

```shell
sudo rm -r /Applications/Zenmap.app
sudo rm /usr/local/bin/{ncat,ndiff,nmap,nmap-update,nping}
sudo rm /usr/local/share/man/*/man1/nmap.1
sudo rm /usr/local/share/man/man1/{ncat,ndiff,nping,nmap-update}.1
sudo rm -r /usr/local/share/{nmap,ncat}
```
