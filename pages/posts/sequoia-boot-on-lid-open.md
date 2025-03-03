---
title: 在macOS Sequoia (15.x) 中阻止开盖/连接电源自动开机的方法
date: 2025-1-31
lang: zh
plum: false
---

# 前言

2025年1月30日，苹果更新了说明文档，在搭载`Apple Silicon`的Mac**笔记本**中，可以设置开盖/连接电源时不自动开机的功能。

# 具体方法

打开`访达(Finder)` -> `实用工具(Utilities)` -> `终端(Terminal)`

输入以下命令：

- 阻止开盖和连接电源自动启动：

  ```shell
  sudo nvram BootPreference=%00
  ```

- 仅阻止开盖自动启动：

  ```shell
  sudo nvram BootPreference=%01
  ```

- 仅阻止连接电源自动启动：
  ```shell
  sudo nvram BootPreference=%02
  ```

上述命令之后，用户输入管理员密码并按下回车键（终端不会显示输入的密码）。

# 还原设置

如果想撤销更改，在终端输入

```shell
sudo nvram -d BootPreference
```

即可。
