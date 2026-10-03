---
title: 如何完全卸载 ACE Studio
date: 2026-10-03
lang: zh
art: dots
type: note
---

要完全卸载 ACE Studio（时空声联旗下的 AI 歌声合成软件）并清除其本地残留文件，请根据您的操作系统（Windows 或 Mac）按照以下步骤操作。

## 💻 Windows 系统彻底卸载步骤

### 1. 基础卸载

- 按下 `Win + i` 快捷键打开**设置**。
- 依次进入**应用** -> **安装的应用**（或**应用和功能**）。
- 在列表中找到 **ACE Studio**，点击右侧的三个点并选择**卸载**。

### 2. 清理本地残留数据（核心步骤）

Windows 自带的卸载程序通常会留下缓存和配置文件，需要手动删除：

- 按下 `Win + R` 键打开“运行”窗口，输入 `%localappdata%` 并回车。
- 在弹出的文件夹中，找到 `Programs` 文件夹，检查里面是否有名为 `ACE Studio` 或 `timedomain` 的残留文件夹，有则直接删除。
- 返回刚才的目录，检查是否有名为 `ACE Studio` 的独立文件夹（用于存放缓存、工程备份等），将其删除。
- 再次按下 `Win + R`，输入 `%appdata%` 并回车，检查并删除其中的 `ACE Studio` 文件夹。

### 3. 清理残留的 VST3 桥接插件

如果您在宿主软件（DAW）中使用了 ACE Bridge 插件，需手动清理：

- 前往路径：`C:\Users\你的用户名\AppData\Local\Programs\Common\VST3`
- 前往路径：`C:\Program Files\Common Files\VST3`
- 检查并删除名为 `ACE Bridge` 或带有 `ACE Studio` 字样的 `.vst3` 文件。

## 🍏 Mac 系统彻底卸载步骤

### 1. 基础卸载

- 打开**访达（Finder）**，进入**应用程序（Applications）**文件夹。
- 找到 **ACE Studio** 图标，将其拖入**废纸篓**（或右键选择“移至废纸篓”）。

### 2. 清理库文件残留

- 在访达菜单栏点击**前往** -> **前往文件夹...**（或按下 `Cmd + Shift + G`）。
- 分别输入以下路径，进去后将与 `ACE Studio` 或 `com.timedomain.acestudio` 相关的文件夹彻底删除：
  - `~/Library/Application Support/`
  - `~/Library/Caches/`
  - `~/Library/Preferences/`（删除相关的 `.plist` 配置文件）

### 3. 清理残留的 AU / VST3 插件

- 同样通过“前往文件夹”，检查并清理音频插件目录：
  - `~/Library/Audio/Plug-Ins/Components/`（清理 AU 插件）
  - `~/Library/Audio/Plug-Ins/VST3/`（清理 VST3 插件）
  - `/Library/Audio/Plug-Ins/Components/`
  - `/Library/Audio/Plug-Ins/VST3/`
