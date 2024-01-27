---
title: 在Hugging Face上寻找一些好玩的项目
date: 2023-12-31
lang: zh
plum: true
---

# 序

~~摸了，今年最后发一篇博客了，剩下的明年再发~~ （）

想玩一些简单的AI语言生成，但是不会写代码，或者没有足够强♂劲的硬件来进行模型训练和推理? 

那就用Hugging Face来~~白嫖~~别人的项目吧！

我克隆了一个VITS语音合成的项目，可以在这玩2333

[https://huggingface.co/spaces/vincent-the-gamer/vits-uma-genshin-honkai](https://huggingface.co/spaces/vincent-the-gamer/vits-uma-genshin-honkai)

# Hugging Face是啥？

Hugging Face: [https://huggingface.co/](https://huggingface.co/)

不说这么多废话，我们可以理解它就是`AI界的GitHub`。

在这里你可以找到别人分享的预训练AI模型，用于推理的项目代码，可以在线体验的项目等。

你可以克隆别人的代码，也可以上传自己本地的代码，还可以在线部署项目。

PS: 小项目如`VITS语音生成`可以用免费的CPU方案，跑不动的可以花钱买独显的算力。

![huggingface](/images/posts/hugging-face/hugging-face.png)
![huggingface-login](/images/posts/hugging-face/hugging-face-login.png)

# 如何~~白嫖~~？

很简单，你只要在Hugging Face上搜索就行，比如我们搜索`vits`：

![search](/images/posts/hugging-face/search.png)

我们可以看到4大分类：

- **Models**: 预训练模型，这里都是别人训练好的模型，你可以下载来自己跑推理。
- **Datasets**: 数据集，别人帮你预处理好的数据集，你可以用来自己跑训练。
- **Spaces**: 在线空间，也就是在线运行的项目，你可以点进去玩(\*^▽^\*)。
- **Organizations**: 组织，这个类似于`GitHub`，可以把一些相关项目拉到一个组织下，每个组织都可以加入开发者。

所以，根据需求，你可以在线游玩，也可以本地运行，然后用别人的模型来推理，甚至可以自己拿数据集去训练（）。

# 克隆Space时可能出现的错误

1. TypeError: AsyncConnectionPool.\_\_init\_\_() got an unexpected keyword argument 'socket_options'
   ```
    Traceback (most recent call last):
    File "/home/user/app/app.py", line 4, in <module>
        import gradio as gr
    File "/home/user/.local/lib/python3.10/site-packages/gradio/__init__.py", line 3, in <module>
        import gradio.components as components
    File "/home/user/.local/lib/python3.10/site-packages/gradio/components.py", line 39, in <module>
        from gradio.blocks import Block
    File "/home/user/.local/lib/python3.10/site-packages/gradio/blocks.py", line 19, in <module>
        from gradio import (
    File "/home/user/.local/lib/python3.10/site-packages/gradio/event_queue.py", line 11, in <module>
        from gradio.utils import Request, run_coro_in_background
    File "/home/user/.local/lib/python3.10/site-packages/gradio/utils.py", line 384, in <module>
        class Request:
    File "/home/user/.local/lib/python3.10/site-packages/gradio/utils.py", line 404, in Request
        client = httpx.AsyncClient()
    File "/home/user/.local/lib/python3.10/site-packages/httpx/_client.py", line 1397, in __init__
        self._transport = self._init_transport(
    File "/home/user/.local/lib/python3.10/site-packages/httpx/_client.py", line 1445, in _init_transport
        return AsyncHTTPTransport(
    File "/home/user/.local/lib/python3.10/site-packages/httpx/_transports/default.py", line 275, in __init__
        self._pool = httpcore.AsyncConnectionPool(
    TypeError: AsyncConnectionPool.__init__() got an unexpected keyword argument 'socket_options'
   ```
   这是由于项目前端一般使用huggingface提供的`gradio`，而它依赖的`httpx`版本导致的。

   解决方法：在`files`里修改`requirements.txt`,手动加上指定版本的`httpx`
   ```
   httpx==0.24.1
   ```

   ![files](/images/posts/hugging-face/files.png)
   ![httpx](/images/posts/hugging-face/httpx.png)

# 最后

1. AI好难学啊啊啊啊啊，慢慢学吧Σ(⊙▽⊙"a
2. 关注永雏塔菲喵~， 关注永雏塔菲谢谢喵~（并不