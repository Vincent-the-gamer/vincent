---
title: Agent开发范式
date: 2026-11-13
lang: zh
art: dots
---

> [!TIP] 小贴士
> 查看英文版，点[这里](/posts/agent-dev-paradigm)

## 前言

本范式基于Git仓库实现，以GitHub作为例子，适用于任何Git仓库。

## 准备工作

- 两个Git仓库账号，一个作为你的主账号，作为开发者，这个一般是一定有的，毕竟古法编程时代大家都是自己写代码的嘛。另一个是专门注册给AI Agent使用的，推荐提前配好SSH Key。
- 趁手的AI Agent和LLM（大语言模型），工作效率和质量取决于LLM，同一个LLM配上不同Agent可能也有不同的效果。我一般用DeepSeek Harness + DeepSeek官方API。
- 项目约束：看我的仓库 - [agent-global](https://github.com/Vincent-the-gamer/agent-global)，这个仓库的AGENTS-pr.md主要告诉Agent，工作空间控制在项目内，且git提交仅仅允许使用Pull Request形式，禁止私自提交到主分支。我还提供了一些基础Skill，可自行选用。

## 正式开始

直接让Agent拉取你想要让它开发的项目，如果项目没有上述AGENTS.md，可以让它帮忙写进去，然后按照正常需求开发就好，一般它不会自动创建PR，当你对功能验收通过时，再让它提PR就好。