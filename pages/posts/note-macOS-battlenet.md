---
title: 如何完全卸载macOS端的暴雪战网客户端
date: 2025-01-01
lang: zh
art: dots
type: note
lastModified: 2025-01-11 12:48:00
---

首先使用清理工具对客户端进行卸载，然后查看并删除：

1. `~/Library/Application Support/Blizzard`文件夹。
2. `~/Library/Preferences`里面删除：
   ```
   com.blizzard.errorreporter.plist
   com.blizzard.Installer.plist
   com.blizzard.launcher.plist
   net.battle.net.app.plist
   net.battle.Authenticator.prefs
   net.battle.Identity.prefs
   net.battnet.battle.plist
   ```
3. `/Users/Shared`里面删除:
   ```
   Battle.net文件夹
   Blizzard文件夹
   ```

然后全局搜索`battle`, `blizzard`等关键词来查看有没有完全删除相关文件。

最后重启清空启动台（Launchpad）的残留图标。
