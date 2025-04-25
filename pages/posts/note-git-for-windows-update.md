---
title: Windows版git无法通过命令更新的情况
date: 2025-04-25
lang: zh
art: dots
type: note
---

# 前言

2024年4月24日，`git`最新版本为`2.49.0`，我久违地把Windows平板开机，顺便更新一波软件。更新git我一般是使用：

```shell
git update-git-for-windows
```

命令来更新，但是却报错了：

```
PS C:\WINDOWS\system32> git update-git-for-windows
Git for Windows 2.45.2.windows.1 (64-bit)
Update 2.49.0.windows.1 is available
curl: (43) A libcurl function was given a bad argument 
```

有[GitHub Issue](https://github.com/git-for-windows/git/issues/5083)提及了该问题，解决办法如下。

# 解决方法

需要修改git-update-git-for-windows这个命令的代码：

- 打开git安装目录下的mingw64子目录的bin子目录，找到git-update-git-for-windows文件用文本编辑软件打开(我使用VSCode，没有的记事本也行)
- 删去该文件原124行: `--write-out '%{http_code}' \`
- 更新该文件原128行`if test "$code" -ge 400`为: `if test "${code:-0}" -ge 400`
- 保存更新后的文件

然后重新运行`git update-git-for-windows`即可。

```
PS C:\WINDOWS\system32> git update-git-for-windows
Git for Windows 2.45.2.windows.1 (64-bit)
Update 2.49.0.windows.1 is available
Download and install Git for Windows v2.49.0.windows.1 [N/y]? y
#####
```