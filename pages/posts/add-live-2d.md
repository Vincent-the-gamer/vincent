---
title: 如何在前端页面中加入看板娘
date: 2023-02-26
lang: zh
---

# 演示图片

<Live2dDemo/>


# 下载看板娘

本博客采用的是大佬stevenjoezhang的看板娘

下载看板娘： [https://github.com/stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget)

解压，得到一个文件夹，改名为`live2d-widget`，方便后续引入。



# 把看板娘加入到页面中

1. 打开前面解压的文件，修改autoload.js

   前面几行的路径改成绝对路径，不要用这个cdn，jsdelivr现在好像不管用了，反正我这跳到了raw.githubusercontent导致用不了了。

   ~~~js
   // live2d_path 参数建议使用绝对路径
   // const live2d_path = "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/";
   
   const live2d_path = "你的路径/live2d-widget/";
   ~~~

2. 修改下面的代码，用api加载模型，还是一样的道理，把CDN注掉，CDN加载不出模型

   ~~~js
   // 加载 waifu.css live2d.min.js waifu-tips.js
   if (screen.width >= 768) {
   	Promise.all([
   		loadExternalResource(live2d_path + "waifu.css", "css"),
   		loadExternalResource(live2d_path + "live2d.min.js", "js"),
   		loadExternalResource(live2d_path + "waifu-tips.js", "js")
   	]).then(() => {
   		// 配置选项的具体用法见 README.md
   		initWidget({
   			waifuPath: live2d_path + "waifu-tips.json",
   			apiPath: "https://live2d.fghrsh.net/api/",
   			// cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/",
   			tools: ["hitokoto", "asteroids", "switch-model", "switch-texture", "photo", "info", "quit"]
   		});
   	});
   }
   ~~~

3. 在页面引入, 使用静态引入方式，不管是原生html，还是前端框架，找到html入口文件，在head中引入autoload.js

~~~html
<head>
<!-- 建议使用绝对路径 -->
<script src="你的路径/live2d-widget/autoload.js"></script>
</head>
~~~

      

# 自定义样式

打开waifu.css，可以修改样式，比如：

看板娘默认是**出现在左边**，你可以通过修改如下css让看板娘**显示在右边**

~~~css
// 让看板娘显示在左边，就使用原配置，显示在右边就把对应属性改成后面注释的内容
#waifu {
	bottom: -1000px;
	left: 0;   // 这里修改成right: 0;   注意分号一定要写
	line-height: 0;
	margin-bottom: -10px;
	position: fixed;
	transform: translateY(3px);
	transition: transform .3s ease-in-out, bottom 3s ease-in-out;
	z-index: 1;
}

#waifu-tool {
	color: #aaa;
	opacity: 0;
	position: absolute;
	right: -10px;   // 修改成left: 0;   
	top: 70px;   
	transition: opacity 1s;
}
~~~

