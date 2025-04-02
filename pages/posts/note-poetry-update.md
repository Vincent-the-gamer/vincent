---
title: 记录一次poetry版本更新问题解决方案
date: 2025-01-18
lang: zh
type: note
art: dots
---

# 前言

[**Poetry**](https://python-poetry.org/)是Python的包管理器之一，设计更现代化，类似于Rust语言的[**Cargo**](https://github.com/rust-lang/cargo)。

# 记录

博客撰写本日，我从Poetry v1更新大版本至v2时，发现国内源镜像库：`poetry-plugin-pypi-mirror`版本与旧版冲突（由于在国内使用，需要镜像换源），因为旧版的该库不兼容v2版本，升级poetry会直接报错，而升级该库也会报错。

# 解决方案

其实也没啥：

1. 卸载`poetry-plugin-pypi-mirror`:

```shell
poetry self remove poetry-plugin-pypi-mirror
```

2. 升级poetry

```shell
poetry self update
```

3. 重新全局安装最新版`poetry-plugin-pypi-mirror`:

```shell
poetry self add poetry-plugin-pypi-mirror
```
