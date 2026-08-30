---
title: 文件完整性校验的方法(SHA-256值)
date: 2026-08-30
lang: zh
art: dots
type: note
---

## 使用终端命令计算文件SHA-256
macOS: 

```bash
shasum -a 256 <文件路径>
```

Windows(cmd):
```bash
certutil -hashfile "文件绝对路径" SHA256
```

Windows(powershell):
```bash
Get-FileHash -Path "文件绝对路径" -Algorithm SHA256
```

Linux:

```bash
sha256sum <文件路径>
```

计算哈希值后与**官方权威文件来源的哈希值**进行比对，若一致则文件完整，并且未被篡改。