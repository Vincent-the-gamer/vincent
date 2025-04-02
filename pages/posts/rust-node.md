---
title: 探究Rust和Node.js以及浏览器环境的交互
date: 2025-03-19
lang: zh
art: dots
---

> [!NOTE] 省流
> 如果你懒得看这篇博客，我准备了两个模板项目，直接克隆到本地就可以使用：
> - 使用Rust开发Node.js模块：[neon-starter](https://github.com/Vincent-the-gamer/neon-starter), 基于Neon框架，用于编写一些小型模块，如果你需要编写大型项目，更推荐[napi-rs](https://github.com/napi-rs/napi-rs)
> - 使用Rust开发浏览器可用的方法，基于WebAssembly技术：[rust-wasm-starter](https://github.com/Vincent-the-gamer/rust-wasm-starter)
>
> 推荐使用node的工具`degit`进行克隆，这样不会克隆.git目录，方便自己初始化新的git项目。
> ```shell
> npx degit <仓库地址>
> ```


# 引言

不知道为啥，互联网上掀起了一股<a href="https://github.com/ansuz/RIIR" target="_blank"><Ruby content="R" rt="Rewrite"/><Ruby content="I" rt="It"/><Ruby content="I" rt="In"/><Ruby content="R" rt="Rust"/></a>的风潮。顾名思义就是把一些比较依赖运行效率的软件通过Rust重写，由于Rust的静态编译特性，使得代码运行速度会快于大多数动态语言 ~~(虽然编译速度很慢)~~，所以我也在不久前(23年底大概)开始学习Rust语言。由于平时本来就和`Node.js`打交道比较多，再加上Evan You（尤雨溪）团队开始使用`Rust`开发新的前端构建工具`rolldown`，所以就想研究下能不能用Rust来编写Node.js和在浏览器中可用的函数。 ~~（其实就是想多写写Rust熟悉一下）~~

# 与Node.js的交互

我主要研究了两个框架：[`Napi-rs`](https://napi.rs/cn)和[`Neon`](https://neon-rs.dev/)，他们都是用来开发Node.js模块的框架，但是在使用体验上有一些区别。

## Napi-rs和Neon的区别

### Napi-rs比Neon设计更优秀

#### 编码

其实从编码角度上来说，`Napi-rs`是比`Neon`设计更优秀的，因为它对函数的包装只需要一个`#[napi]`宏，就可以在编译时将函数转换为JavaScript可用函数：

```rust
use napi_derive::napi;
 
#[napi] // [!code hl]
fn fibonacci(n: u32) -> u32 {
  match n {
    1 | 2 => 1,
    _ => fibonacci(n - 1) + fibonacci(n - 2),
  }
}
```

如果你使用`Neon`，需要自己处理数据类型的转换，会写出不少冗余代码(虽然有`neon-serde`这种简化操作过程的库，不过还是比较麻烦)。

例如，你从函数获得的参数需要手动转为`Rust`可读的类型，然后返回时要转换为`JavaScript`可读的类型。

```rust
use neon::{
    prelude::{Context, FunctionContext}, result::JsResult, types::JsString
};

// Echo your text in param
pub fn echo(mut cx: FunctionContext) -> JsResult<JsString> {
    // read the first param of function
    let get_str: String = cx.argument::<JsString>(0)?.value(&mut cx); // [!code hl]
    let result: String = format!("Echoed text: {}", &get_str); 
    Ok(cx.string(result)) // [!code hl]
}
```

#### 文档
`Napi-rs`的文档较为详细, 而`Neon`的文档甚至感觉还不完善。

#### TypeScript支持
`Napi-rs`会自动生成TS类型声明文件`*.d.ts`，为TypeScript提供更好的支持，而`Neon`默认没有提供这样的功能。


### Neon比Napi-rs的工作空间更轻量化

通过脚手架初始化两个框架的项目，你会发现，`Napi-rs`的工作空间里面文件很多，而`Neon`则比较轻量化，可以对比[Napi-rs官方文档](https://napi.rs/cn/docs/introduction/simple-package)以及[Neon官方文档](https://neon-rs.dev/docs/hello-world)中两者项目结构的区别。如果你只想开发一个轻量级库，推荐使用`Neon`，大型项目或者较为正式的项目推荐`Napi-rs`。

> [!TIP] 提示
> 如果您更喜欢pnpm, `npm init` 命令可以用 `pnpm create` 命令代替。

- Napi-rs项目的初始化: 
    ```shell
    npm i -g @napi-rs/cli
    napi new
    ```
- Neon项目的初始化:
    ```shell
    npm init neon <你的项目名称>
    # 或者pnpm
    pnpm create neon <你的项目名称>
    ```

两者最主要的区别基本就这些，当然还有一些细小的区别可能我还没有探究出来。总之根据自己的实际情况，选择适合自己的框架即可。

# 与浏览器（Web项目）的交互 —— WebAssembly

_对于 Web 平台而言，WebAssembly 具有巨大的意义——它提供了一条使得以各种语言编写的代码都可以接近原生的速度在 Web 中运行的途径，使得以前无法在 Web 上运行的客户端应用程序得以在 Web 上运行。_(摘自[MDN](https://developer.mozilla.org/zh-CN/docs/WebAssembly))

通过WebAssembly(下称WASM)，我们可以将Rust编写的方法暴露给浏览器环境中的JavaScript使用。Rust提供了`wasm-pack`工具用来将Rust Library构建成为WebAssembly模块，同时配合`wasm-bindgen`crate来对Rust函数进行宏标注，这样就能指定哪些函数会被编译到WASM中。

## 如何将Rust函数编译成WebAssembly模块

> [!IMPORTANT] 重要
> 并不是所有函数都支持被打包到WASM，比如一些引入了第三方库的方法，举个🌰：使用`mysql` crate操作数据库的函数。~~(别问我怎么知道的)~~

你可以在Rust项目中专门创建一个`wasm` crate，然后从其它crate中引入需要编译进WASM中的函数: 

```rust
use demo::add_two;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn add(left: u8, right: u8) -> u8 {
    add_two(left, right)
}
```

编译WASM时，你只需要对wasm这个crate单独运行编译命令即可。

> [!CAUTION] 注意
> 要在浏览器环境中使用，请加上`--target web`。
> `--out-dir`可以指定输出目录，默认为pkg，生成目录的相对路径为`wasm` crate的路径。

```shell
wasm-pack build ./wasm --target web --out-dir output
```

这样就能编译出对应的WASM模块了。

## 如何在前端项目中调用WebAssembly模块

> [!TIP] 小贴士
> 如果想体验WebAssembly模块在前端运行，可以来我的[这篇文档](https://felab.vince-g.xyz/docs/coding/leetcode/findMedianSortedArrays.html)

通过`wasm-pack`打包的WASM模块中，包含了`wasm_bg.wasm`文件和`wasm.js`，他们两个均可以作为WASM的入口，但是使用方式有所区别：

### 使用`wasm_bg.wasm`文件作为入口

```ts
import init from './wasm_bg.wasm?init'

init().then((instance) => {
  // 假设你暴露了一个test函数
  instance.exports.test()
})
```

`.wasm`文件没有暴露出函数，所以我们只能在wasm模块初始化完成后拿到实例才能取得内部暴露的函数，这种方式很难将函数应用到JavaScript代码中。

### 使用`wasm.js`作为入口

```ts
import init, { add } from "xxx/output/wasm.js"

function addTwo() {
    const content = document.getElementById("content")
    const left = document.getElementById("left").value
    const right = document.getElementById("right").value
    const result = add(left, right)
    content.innerText = result
}

init().then()
```

在JS入口中，已经提前暴露出了内部函数，你可以将函数运用在任意其他JavaScript代码段中，但是，**函数的执行时间必须在`init().then()`初始化函数执行之后**。

### 在Vite中使用WebAssembly

如果要在Vite中使用WASM，请安装[vite-plugin-wasm](https://github.com/Menci/vite-plugin-wasm), 并且在`vite.config.ts`进行如下配置：

> [!IMPORTANT] 重要
> 对于旧版浏览器不支持顶层await的，需要安装`vite-plugin-top-level-await`

```ts
// vite.config.ts
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait()
  ]
});
```