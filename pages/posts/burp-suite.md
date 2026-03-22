---
title: Burp Suite学习版安装及配置(以macOS系统为例)
date: 2026-03-22
lang: zh
art: dots
---

## 序

Burp Suite是一款用于Web应用安全测试的集成化工具，由PortSwigger Web Security开发，是渗透测试领域的标准利器。它通过拦截HTTP/HTTPS流量作为代理中间人，实现对Web应用的主动/被动扫描、漏洞分析、请求重放、爆破测试等功能，包含社区版、专业版和企业版。

## Burp Suite Professional 学习版安装

> [!IMPORTANT] 重要
> 本教程基于macOS系统演示，Windows类似，学习补丁keygen是jar包，所以使用方法基本一样

macOS版客户端默认内置了jre，故无需依赖额外的JRE/JDK。mac端将客户端拖到应用程序后，首先`右键 -> 显示包内容`，进入以下路径：

```bash
/Applications/Burp Suite Professional.app/Contents/Resources/app/
```

将学习补丁中的`BurpLoaderKeygen.jar`和`BurpSuiteChs.jar`放入该文件夹，

- `BurpLoaderKeygen.jar`： 「学习」器
- `BurpSuiteChs.jar`：汉化补丁

对于macOS，如果打开客户端提示`请移动到废纸篓`

![xattr](/images/posts/burp-suite/xattr.png)

则运行：

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Burp Suite Professional.app"
```

然后！！！！**先打开一次Burp客户端，看到需要输入license key后关闭客户端。**

然后启动学习器：

```bash
"/Applications/Burp Suite Professional.app/Contents/Resources/jre.bundle/Contents/Home/bin/java" -jar "/Applications/Burp Suite Professional.app/Contents/Resources/app/BurpSuiteKeygen.jar"
```

**接下来这步非常关键**：使用学习器运行BurpSuite。

![xuexi](/images/posts/burp-suite/xuexi.png)

补丁中有一个Loader Command的输入框，将下面的命令复制到框中，点Run，它会打开Burp。

这里懒得截图了，用个Win的，这个补丁是一样的。

> [!WARNING] 注意
> 以下命令仅适用于macOS，Windows可举一反三，其实就是用JRE运行jar包。

```bash
"/Applications/Burp Suite Professional.app/Contents/Resources/jre.bundle/Contents/Home/bin/java" "--add-opens=java.desktop/javax.swing=ALL-UNNAMED" "--add-opens=java.base/java.lang=ALL-UNNAMED" "--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED" "--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED" "--add-opens=java.base/jdk.internal.org.objectweb.asm.Opcodes=ALL-UNNAMED" "-javaagent:BurpSuiteKeygen.jar"  "-jar" "/Applications/Burp Suite Professional.app/Contents/Resources/app/burpsuite_pro.jar"
```

然后复制学习器中的license填入，点击下一步

之后，点击**Manual Activation**，在Keygen填入Request码，然后复制Response码到Burp，点击验证即可完成「学习」流程。

![activate](/images/posts/burp-suite/activate.jpg)

## 浏览器配置

Burp内置了Chromium，但是不建议使用，有的网站无法正常打开

故打开内嵌浏览器，访问`https://burp`下载CA证书，然后添加到**你自己的浏览器中**

**以Chrome为例**，Chrome访问：`chrome://certificate-manager/`，将 `cacert.der` 导入即可

然后下载`Proxy SwitchyOmega`浏览器代理插件，并将代理规则设置为Burp监听的地址。

如果流量要走Clash系统代理，那么需要在Burp中配置Socks代理：

![socks](/images/posts/burp-suite/socks.png)

这样也能抓海外流量包啦～

不用的时候，记得将SwitchyOmega设置为直连或者系统代理（当使用梯子时）。
