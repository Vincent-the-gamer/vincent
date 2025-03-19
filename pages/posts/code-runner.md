---
title: 如何实现一个简单的基于Node.js的代码运行方法
date: 2025-02-26
lang: zh
plum: false
lastModified: 2025-03-19 14:56
---

# 需要的工具

- Node.js环境
- 一个代码编辑器，推荐VS Code

# 方法

这两天研究怎么把文言文编程语言的运行过程本地化，通过`@wenyan/core`模块可以将文言文代码编译成`JavaScript`,`Python`或`Ruby`。为了不在同一项目中同时使用Node和Python，就直接用JS代码了，接下来就是重点，怎么拿到`console.log`的结果?

昨天研究了半天，发现JS很难拿到`process.stdout`流中输出的文本，所以就只能曲线救国了：

**将编译后的JS写入一个`.js`后缀的文件，然后使用node的`exec`函数运行文件，即可获得stdout的文本。** 这个方法的灵感来源于[glot.io](https://glot.io/)这个在线运行代码的网站。通过对网站核心模块代码(开源，可以在[这里](https://github.com/glotcode)找到)的观察，发现也是通过文件的方式拿到输出流文本的。

所以就有了以下的代码：（目前该代码已经集成到[我的私人API](https://github.com/Vincent-the-gamer/api/blob/main/tools/codeRunner.ts)上）

```ts
import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 这里是为了扩展做准备
export enum Language {
  JavaScript,
}

export function run(lang: Language, code: string): Promise<string> {
  switch (lang) {
    case Language.JavaScript:
      return new Promise((resolve, reject) => {
        fs.writeFile(`${__dirname}/main.js`, code, (err) => { // [!code hl]
          if (err)
            reject('Write file error!')

          exec(`node ${__dirname}/main.js`, (err, stdout, stderr) => { // [!code hl]
            if (stdout) {
              resolve(stdout)
            }
            if (stderr)
              reject(stderr)
          })
        })
      })
    default:
      break
  }
}
```

使用Promise可以确保当文件完成写入后，运行代码获取到stdout的文本之后再运行后续代码，防止因异步而导致拿不到输出结果。
