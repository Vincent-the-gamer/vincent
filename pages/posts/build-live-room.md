---
title: 在本地搭建一个视频直播推流服务(rtmp + hls)
date: 2025-11-15
lang: zh
art: dots
---

## 准备

- Xiu：核心服务，用Rust开发的直播推流服务
- OBS：用于推流
- 本地播放器：用于播放.m3u8流（本地调试）
- 公网IP或内网穿透服务：用于暴露直播流到公网

## 开始搭建

首先，你需要查看Xiu的文档：

- GitHub: https://github.com/harlanc/xiu
- 文档: https://www.rustxiu.com/

选取一种方式安装xiu到本地，我是直接从Release下载可执行文件，这种情况下，需要手动赋予文件可执行权限：

```shell
chmod +x /path_to/xiu
```

之后根据文档编写配置文件（推荐），命令行也能传参，但是比较麻烦

比如我的配置文件`xiu.conf`如下：

```toml
##########################
#   RTMP configurations  #
##########################
[rtmp]
enabled = true #打开或者关闭RTMP媒体协议
port = 1935 #指定RTMP协议监听端口
gop_num = 0 #指定缓存GOP数量，用于秒开（会增加延迟）

[rtmp.auth] 
pull_enabled = true # 是否开启拉流鉴权
push_enabled = true  # 是否开启推流鉴权
algorithm = "simple" #设置鉴权方式 支持简单鉴权和MD5鉴权(分别填simple或者md5)

##########################
#    HLS configurations  #
##########################
[hls]
enabled = true  #打开或者关闭RTSP媒体协议
port = 2000  #指定协议监听端口
need_record = false #是否打开HLS录制

[hls.auth] 
pull_enabled = true #是否开启拉流鉴权
algorithm = "simple" #设置鉴权方式 支持简单鉴权和MD5鉴权(分别填simple或者md5)

[authsecret]
# used for md5 authentication.  
key = "good"
# used for simple authentication
password = "well"
```

我简单地配置了rtmp（用于OBS推流）和hls（用于前端拉流播放）协议用于在我的博客中搭建直播间，

直播间地址：[直播间](/live)

配置文件写好后，使用：

```shell
/path_to/xiu -c xiu配置文件
```

即可加载配置文件参数启动服务

## 如何推/拉流

按照上面的配置：

- 推流地址(RTMP)：rtmp://IP:1935/{app_name}/{stream_name}?token=well
- 拉流地址(HLS)：http://IP:2000/{app_name}/{stream_name}/{stream_name}.m3u8?token=well

其中：
1. 推流地址使用`rtmp`协议，端口为你配置的`rtmp端口`，后面的app_name和stream_name可以自定义，分别为app名称和流名称。
token为你配置的鉴权参数，根据文档，鉴权方式有`md5`和`simple`，我这里使用`simple`，鉴权方式就是直接传token参数，值为你的配置。
2. 拉流地址使用`http`协议，实则为HLS服务，端口为你配置的`HLS端口`, 注意，**此处的app_name和stream_name必须与您的推流地址相同！！**
然后鉴权token也需要一致。

## 直播间前端搭建
最后，您需要一个直播间前端，只需要把直播间放在网页或是其它你喜欢的地方即可，通过一些现成工具即可播放实时HLS流。