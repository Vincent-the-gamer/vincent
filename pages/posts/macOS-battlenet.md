---
title: 如何完全卸载macOS端的暴雪战网客户端
date: 2025-01-01
lang: zh
plum: false
---

首先使用清理工具对客户端进行卸载，然后查看并删除：
1. ~/Library/Application Support/Blizzard 中的 Battle.net 文件夹。
2. ~/Library/Preferences里面删除：
    ```
    com.blizzard.errorreporter.plist
    com.blizzard.Installer.plist
    com.blizzard.launcher.plist
    net.battle.net.app.plist
    net.battle.Authenticator.prefs
    net.battle.Identity.prefs
    net.battnet.battle.plist
    ```

然后全局搜索battle, blizzard来查看有没有完全删除相关文件。
