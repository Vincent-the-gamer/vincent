---
title: macOS完全卸载Flutter和Dart的步骤
date: 2025-05-02
lang: zh
art: dots
type: note
---

# 卸载SDK

假设在`macOS`系统下你的Flutter SDK安装目录为: `~/development`

那么，删除 `~/development/flutter` 文件夹

# 删除Flutter配置文件

```
~/.flutter
~/.flutter-devtools
~/.flutter_settings
```

# 删除Dart配置文件

```
~/.dart
~/.dart-tool
~/.dartServer
```

# 删除pub包

```
~/.pub-cache
```

# 删除环境变量

如果您将环境变量配置在`~/.zshenv`中，则打开该文件，删除这一行:

```shell
export PATH=$HOME/development/flutter/bin:$PATH
```