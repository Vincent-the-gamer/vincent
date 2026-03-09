---
title: OpenClaw安装使用
date: 2026-03-09
lang: zh
art: dots
---

> [!NOTE] 注意
> 后续逐步完善本文章。

## 前期准备

- Node.js开发环境：请安装最新LTS版本。
- **核心**：准备一个LLM(大语言模型)的服务，本地部署/云端部署/第三方服务均可，考虑到Token消耗量较大，推荐本地部署，如果实在没办法，可以选择租用云服务器云端部署
- Openclaw安装：在你想要让Agent操控的那台机器上安装。

## 安装步骤

1. [下载安装Node.js](https://nodejs.org/zh-cn)，下载最新的LTS（长期维护）版本。
   国内用户请更换国内npm镜像源：
   ```bash
   npm config set registry https://registry.npmmirror.com
   ```
2. 安装OpenClaw，可以使用npm，也可以直接用脚本

   npm:

   ```bash
   npm install -g openclaw

   # 启动
   openclaw onboard
   ```

   脚本:

   ```bash
   # Linux/macOS
   curl -fsSL https://openclaw.ai/install.sh | bash

   # Windows
   iwr -useb https://openclaw.ai/install.ps1 | iex
   ```

3. 配置OpenClaw：

当首次运行openclaw，它会引导你进行配置，为了访问安全，最好配置使用token登录，毕竟密码登录还是不够安全。

在引导中，你可以选择立刻配置，或者跳过，后续配置，我们初始化需要配置的东西如下：

> [!IMPORTANT] 重要
> 并不是现在必须配置，你也可以选择之后配置。

**配置大语言模型(LLM) API**：根据提示输入你的LLM服务地址和API密钥，这一步根据你的大模型服务商，过程可能不同，建议参考：

- 你的大模型服务商文档，或者本地部署模型的文档，如Ollama的文档：[Ollama文档](https://docs.ollama.com/)
- OpenClaw文档：[OpenClaw文档](https://docs.openclaw.ai/)

**对接聊天平台**：OpenClaw支持多种聊天平台，如Discord、Telegram等，根据你的需求选择合适的平台，具体方法可参考：[OpenClaw文档](https://docs.openclaw.ai/)

Openclaw的主配置是`<用户文件夹>/.openclaw/openclaw.json`，后续补充配置都可以通过修改这个文件完成。

配置文件示例如下：

```json
{
  "meta": {
    "lastTouchedVersion": "2026.3.7",
    "lastTouchedAt": "2026-03-09T05:36:14.418Z"
  },
  "wizard": {
    "lastRunAt": "2026-03-09T04:32:02.366Z",
    "lastRunVersion": "2026.3.7",
    "lastRunCommand": "onboard",
    "lastRunMode": "local"
  },
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://127.0.0.1:11434",
        "apiKey": "ollama-local",
        "api": "ollama",
        "models": [
          {
            "id": "kimi-k2.5:cloud",
            "name": "kimi-k2.5:cloud",
            "reasoning": true,
            "input": ["text", "image"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 262144,
            "maxTokens": 262144
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/kimi-k2.5:cloud"
      },
      "models": {
        "ollama/kimi-k2.5:cloud": {}
      },
      "workspace": "C:\\Users\\<user_name>\\.openclaw\\workspace",
      "compaction": {
        "mode": "safeguard"
      }
    }
  },
  "tools": {
    "profile": "coding",
    "web": {
      "search": {
        "enabled": false
      }
    }
  },
  "commands": {
    "native": "auto",
    "nativeSkills": "auto",
    "restart": true,
    "ownerDisplay": "raw"
  },
  "session": {
    "dmScope": "per-channel-peer"
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "lan",
    "controlUi": {
      "allowedOrigins": ["https://localhost:18789", "https://127.0.0.1:18789"]
    },
    "auth": {
      "mode": "token",
      "token": "xxx"
    },
    "tls": {
      "enabled": true
    },
    "nodes": {
      "denyCommands": [
        "camera.snap",
        "camera.clip",
        "screen.record",
        "contacts.add",
        "calendar.add",
        "reminders.add",
        "sms.send"
      ]
    }
  },
  "skills": {
    "install": {
      "nodeManager": "pnpm"
    }
  },
  "plugins": {
    "entries": {
      "openclaw-web-search": {
        "enabled": true
      }
    }
  }
}
```

到这一步，OpenClaw的安装基本完成

## 安装配置Skills

OpenClaw的能力基本来自Skills，它本身自带了一部分，其它的部分，你可以自己研究，然后搜索安装

用命令行搜索skills:

```bash
# 搜索到想要的skill以后安装即可
npx skills search
```

### 推荐的skills

- find-skills: 在对话中帮助你找到合适的skills并安装调用
- self-improvement: 会不断学习，自我纠错，提高对话质量
