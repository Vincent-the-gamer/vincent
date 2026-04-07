---
title: macOS如何完全卸载Docker
date: 2026-04-07
lang: zh
art: dots
type: note
---

> [!NOTE] 说明
> 参考：https://yqqy.top/blog/2022/uninstall-docker-on-macos
>
> 仅在图片上做了替换，用于适配新版Docker的情形

## 情况一：可以打开Docker Desktop

在 Mac 上打开Docker Desktop，在上方状态栏中找到troubleshoot然后点击。

![menu](/images/posts/uninstall-docker/menu.png)

进入troubleshoot菜单后可点击Uninstall按钮完全卸载Docker

![troubleshoot](/images/posts/uninstall-docker/troubleshoot.png)

## 情况二：打不开 Docker Desktop

用命令行执行：

```bash
/Applications/Docker.app/Contents/MacOS/Docker --uninstall
```

## 情况三：打不开 Docker Desktop 且情况二无法解决

用卸载工具，如Clean My Mac或腾讯柠檬等卸载Docker

然后用命令行执行以下命令，逐个删除残留文件

```bash
sudo rm -Rf /Applications/Docker.app
sudo rm -f /usr/local/bin/docker
sudo rm -f /usr/local/bin/docker-machine
sudo rm -f /usr/local/bin/com.docker.cli
sudo rm -f /usr/local/bin/docker-compose
sudo rm -f /usr/local/bin/docker-compose-v1
sudo rm -f /usr/local/bin/docker-credential-desktop
sudo rm -f /usr/local/bin/docker-credential-ecr-login
sudo rm -f /usr/local/bin/docker-credential-osxkeychain
sudo rm -f /usr/local/bin/hub-tool
sudo rm -f /usr/local/bin/hyperkit
sudo rm -f /usr/local/bin/kubectl.docker
sudo rm -f /usr/local/bin/vpnkit
sudo rm -Rf ~/.docker
sudo rm -Rf ~/Library/Containers/com.docker.docker
sudo rm -Rf ~/Library/Application\ Support/Docker\ Desktop
sudo rm -Rf ~/Library/Group\ Containers/group.com.docker
sudo rm -f ~/Library/HTTPStorages/com.docker.docker.binarycookies
sudo rm -f /Library/PrivilegedHelperTools/com.docker.vmnetd
sudo rm -f /Library/LaunchDaemons/com.docker.vmnetd.plist
sudo rm -Rf ~/Library/Logs/Docker\ Desktop
sudo rm -Rf /usr/local/lib/docker
sudo rm -f ~/Library/Preferences/com.docker.docker.plist
sudo rm -Rf ~/Library/Saved\ Application\ State/com.electron.docker-frontend.savedState
sudo rm -f ~/Library/Preferences/com.electron.docker-frontend.plist
```
