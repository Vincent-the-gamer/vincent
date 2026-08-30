---
title: macOS完全卸载Android Studio的步骤
date: 2025-05-02
lang: zh
art: dots
type: note
---

# 删除Android Studio应用本体

可以使用`CleanMyMacX`等软件清理App本体

# 删除相关文件和缓存

Android Studio 会在系统的多个路径中生成配置文件、缓存、日志和插件。需要手动清理这些文件。

## 配置文件

删除以下目录中的所有 Android Studio 配置文件：

```
~/Library/Application Support/Google/AndroidStudio*
```

## 缓存文件

删除缓存目录：

```
~/Library/Caches/Google/AndroidStudio*
```

## 日志文件

删除日志文件

```
~/Library/Logs/Google/AndroidStudio*
```

## 首选项文件

删除首选项相关的plist文件：

```
~/Library/Logs/Google/AndroidStudio*
```

## Gradle 缓存（可选）

如果你想清除 Gradle 的缓存文件，删除以下目录：

```
~/.gradle
```

## AVD 模拟器文件（可选）

如果使用了 Android Virtual Devices (AVDs) 模拟器，删除以下目录：

```
~/.android
~/Library/Android
```