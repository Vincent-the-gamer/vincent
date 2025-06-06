---
title: 如何学习正则表达式
date: 2024-08-12
lang: zh
art: dots
---

> [!NOTE]
> 本篇文档转载自开源文档：[https://github.com/cdoco/learn-regex-zh](https://github.com/cdoco/learn-regex-zh)

<br/>
<p align="center">
<img src="https://i.imgur.com/bYwl7Vf.png" alt="Learn Regex">
</p><br/>

## 什么是正则表达式 ？

> 正则表达式是一种被用于从文本中检索符合某些特定模式的文本。

正则表达式是从左到右来匹配一个字符串的。“Regular Expression”这个词太长了，我们通常使用它的缩写“regex”或者“regexp”。
正则表达式可以被用来替换字符串中的文本、验证表单、基于模式匹配从一个字符串中提取字符串等等。
<br />

想象一下，您正在编写应用程序，并且您希望在用户选择用户名时设置规则。我们希望用户名可以包含字母，数字，下划线和连字符。
为了让它看起来不丑，我们还想限制用户名中的字符数量。这时我们可以使用以下正则表达式来验证用户名：

<p align="center">
<img src="https://i.imgur.com/UrDb9qc.png" alt="Regular expression">
</p>

上面这个正则表达式可以匹配 `john_doe`，`jo-hn_doe` 和 `john12_as`。但是它不能匹配 `Jo`，因为该字符串里面包含大写字符，并且它太短了。

## 目录

- [基本匹配](#_1-基本匹配)
- [元字符](#_2-元字符)
  - [英文句号](#_2-1-英文句号)
  - [字符集](#_2-2-字符集)
    - [否定字符集](#_2-2-1-否定字符集)
  - [重复](#_2-3-重复)
    - [星号](#_2-3-1-星号)
    - [加号](#_2-3-2-加号)
    - [问号](#_2-3-3-问号)
  - [花括号](#_2-4-花括号)
  - [字符组](#_2-5-字符组)
  - [分支结构](#_2-6-分支结构)
  - [转义特殊字符](#_2-7-转义特殊字符)
  - [定位符](#_2-8-定位符)
    - [插入符号](#_2-8-1-插入符号)
    - [美元符号](#_2-8-2-美元符号)
- [简写字符集](#_3-简写字符集)
- [断言](#_4-断言)
  - [正向先行断言](#_4-1-正向先行断言)
  - [负向先行断言](#_4-2-负向先行断言)
  - [正向后行断言](#_4-3-正向后行断言)
  - [负向后行断言](#_4-4-负向后行断言)
- [标记](#_5-标记)
  - [不区分大小写](#_5-1-不区分大小写)
  - [全局搜索](#_5-2-全局搜索)
  - [多行匹配](#_5-3-多行匹配)
- [常用正则表达式](#常用正则表达式)

## 1. 基本匹配

正则表达式只是我们用于在文本中检索字符串的模式。例如正则表达式 `cat`，表示：字母 `c` 后面跟着一个字母 `a`，再后面跟着一个字母 `t`。

<pre style="color: gray;">
"cat" => The <a href="#learn-regex"><strong>cat</strong></a> sat on the mat
</pre>

正则表达式 `123` 会匹配字符串“123”。通过将正则表达式中的每个字符逐个与要匹配的字符串中的每个字符进行比较，来完成正则匹配。
正则表达式通常区分大小写，因此正则表达式 `Cat` 与字符串“cat”不匹配。

<pre style="color: gray;">
"Cat" => The cat sat on the <a href="#learn-regex"><strong>Cat</strong></a>
</pre>

## 2. 元字符

元字符是正则表达式的基本组成元素。元字符在这里跟它通常表达的意思不一样，而是以某种特殊的含义去解释。有些元字符在写在方括号内时有特殊含义。
元字符如下：

| 元字符 | 描述                                                                                                  |
| :----: | ----------------------------------------------------------------------------------------------------- |
|   .    | 匹配除换行符以外的任意字符。                                                                          |
|  [ ]   | 字符类，匹配方括号中包含的任意字符。                                                                  |
|  [^ ]  | 否定字符类。匹配方括号中不包含的任意字符                                                              |
|   \*   | 匹配前面的子表达式零次或多次                                                                          |
|   +    | 匹配前面的子表达式一次或多次                                                                          |
|   ?    | 匹配前面的子表达式零次或一次，或指明一个非贪婪限定符。                                                |
| {n,m}  | 花括号，匹配前面字符至少 n 次，但是不超过 m 次。                                                      |
| (xyz)  | 字符组，按照确切的顺序匹配字符 xyz。                                                                  |
| &#124; | 分支结构，匹配符号之前的字符或后面的字符。                                                            |
| &#92;  | 转义符，它可以还原元字符原来的含义，允许你匹配保留字符 <code>[ ] ( ) { } . \* + ? ^ $ \ &#124;</code> |
|   ^    | 匹配行的开始                                                                                          |
|   $    | 匹配行的结束                                                                                          |

## 2.1 英文句号

英文句号 `.` 是元字符的最简单的例子。元字符 `.` 可以匹配任意单个字符。它不会匹配换行符和新行的字符。例如正则表达式 `.ar`，表示：任意字符后面跟着一个字母 `a`，
再后面跟着一个字母 `r`。

<pre style="color: gray;">
".ar" => The <a href="#learn-regex"><strong>car</strong></a> <a href="#learn-regex"><strong>par</strong></a>ked in the <a href="#learn-regex"><strong>gar</strong></a>age.
</pre>

## 2.2 字符集

字符集也称为字符类。方括号被用于指定字符集。使用字符集内的连字符来指定字符范围。方括号内的字符范围的顺序并不重要。
例如正则表达式 `[Tt]he`，表示：大写 `T` 或小写 `t` ，后跟字母 `h`，再后跟字母 `e`。

<pre style="color: gray;">
"[Tt]he" => <a href="#learn-regex"><strong>The</strong></a> car parked in <a href="#learn-regex"><strong>the</strong></a> garage.
</pre>

然而，字符集中的英文句号表示它字面的含义。正则表达式 `ar[.]`，表示小写字母 `a`，后面跟着一个字母 `r`，再后面跟着一个英文句号 `.` 字符。

<pre style="color: gray;">
"ar[.]" => A garage is a good place to park a c<a href="#learn-regex"><strong>ar.</strong></a>
</pre>

### 2.2.1 否定字符集

一般来说插入字符 `^` 表示一个字符串的开始，但是当它在方括号内出现时，它会取消字符集。例如正则表达式 `[^c]ar`，表示：除了字母 `c` 以外的任意字符，后面跟着字符 `a`，
再后面跟着一个字母 `r`。

<pre style="color: gray;">
"[^c]ar" => The car <a href="#learn-regex"><strong>par</strong></a>ked in the <a href="#learn-regex"><strong>gar</strong></a>age.
</pre>

## 2.3 重复

以下元字符 `+`，`*` 或 `?` 用于指定子模式可以出现多少次。这些元字符在不同情况下的作用不同。

### 2.3.1 星号

星号 `*` 表示匹配上一个匹配规则零次或多次。正则表达式 `a*` 表示小写字母 `a` 可以重复零次或者多次。但是它如果出现在字符集或者字符类之后，它表示整个字符集的重复。
例如正则表达式 `[a-z]*`，表示：一行中可以包含任意数量的小写字母。

<pre style="color: gray;">
"[a-z]*" => T<a href="#learn-regex"><strong>he</strong></a> <a href="#learn-regex"><strong>car</strong></a> <a href="#learn-regex"><strong>parked</strong></a> <a href="#learn-regex"><strong>in</strong></a> <a href="#learn-regex"><strong>the</strong></a> <a href="#learn-regex"><strong>garage</strong></a> #21.
</pre>

星号 `*` 可以与元符号 `.` 用在一起，用来匹配任意字符串 `.*`。星号 `*` 可以与空格符 `\s` 一起使用，用来匹配一串空格字符。
例如正则表达式 `\s*cat\s*`，表示：零个或多个空格，后面跟小写字母 `c`，再后面跟小写字母 `a`，再在后面跟小写字母 `t`，后面再跟零个或多个空格。

<pre style="color: gray;">
"\s*cat\s*" => The fat<a href="#learn-regex"><strong> cat </strong></a>sat on the <a href="#learn-regex"><strong>cat</strong></a>.
</pre>

### 2.3.2 加号

加号 `+` 表示匹配上一个字符一次或多次。例如正则表达式 `c.+t`，表示：一个小写字母 `c`，后跟任意数量的字符，后跟小写字母 `t`。

<pre style="color: gray;">
"c.+t" => The fat <a href="#learn-regex"><strong>cat sat on the mat</strong></a>.
</pre>

### 2.3.3 问号

在正则表达式中，元字符 `?` 用来表示前一个字符是可选的。该符号匹配前一个字符零次或一次。
例如正则表达式 `[T]?he`，表示：可选的大写字母 `T`，后面跟小写字母 `h`，后跟小写字母 `e`。

<pre style="color: gray;">
"[T]he" => <a href="#learn-regex"><strong>The</strong></a> car is parked in the garage.
</pre>
<pre style="color: gray;">
"[T]?he" => <a href="#learn-regex"><strong>The</strong></a> car is parked in t<a href="#learn-regex"><strong>he</strong></a> garage.
</pre>

## 2.4 花括号

在正则表达式中花括号（也被称为量词？）用于指定字符或一组字符可以重复的次数。例如正则表达式 `[0-9]{2,3}`，表示：匹配至少 2 位数字但不超过 3 位（0 到 9 范围内的字符）。

<pre style="color: gray;">
"[0-9]{2,3}" => The number was 9.<a href="#learn-regex"><strong>999</strong></a>7 but we rounded it off to <a href="#learn-regex"><strong>10</strong></a>.0.
</pre>

我们可以省略第二个数字。例如正则表达式 `[0-9]{2,}`，表示：匹配 2 个或更多个数字。如果我们也删除逗号，则正则表达式 `[0-9]{2}`，表示：匹配正好为 2 位数的数字。

<pre style="color: gray;">
"[0-9]{2,}" => The number was 9.<a href="#learn-regex"><strong>9997</strong></a> but we rounded it off to <a href="#learn-regex"><strong>10</strong></a>.0.
</pre>

<pre style="color: gray;">
"[0-9]{2}" => The number was 9.<a href="#learn-regex"><strong>99</strong></a><a href="#learn-regex"><strong>97</strong></a> but we rounded it off to <a href="#learn-regex"><strong>10</strong></a>.0.
</pre>

## 2.5 字符组

字符组是一组写在圆括号内的子模式 `(...)`。正如我们在正则表达式中讨论的那样，如果我们把一个量词放在一个字符之后，它会重复前一个字符。
但是，如果我们把量词放在一个字符组之后，它会重复整个字符组。
例如正则表达式 `(ab)*` 表示匹配零个或多个的字符串“ab”。我们还可以在字符组中使用元字符 `|`。例如正则表达式 `(c|g|p)ar`，表示：小写字母 `c`、`g` 或 `p` 后面跟字母 `a`，后跟字母 `r`。

<pre style="color: gray;">
"(c|g|p)ar" => The <a href="#learn-regex"><strong>car</strong></a> is <a href="#learn-regex"><strong>par</strong></a>ked in the <a href="#learn-regex"><strong>gar</strong></a>age.
</pre>

## 2.6 分支结构

在正则表达式中垂直条 `|` 用来定义分支结构，分支结构就像多个表达式之间的条件。现在你可能认为这个字符集和分支结构的工作方式一样。
但是字符集和分支结构巨大的区别是字符集只在字符级别上有作用，然而分支结构在表达式级别上依然可以使用。
例如正则表达式 `(T|t)he|car`，表示：匹配大写字母 `T` 或小写字母 `t`，后面跟小写字母 `h`，后跟小写字母 `e`，或匹配小写字母 `c`，后跟小写字母 `a`，后跟小写字母 `r`。

<pre style="color: gray;">
"(T|t)he|car" => <a href="#learn-regex"><strong>The</strong></a> <a href="#learn-regex"><strong>car</strong></a> is parked in <a href="#learn-regex"><strong>the</strong></a> garage.
</pre>

## 2.7 转义特殊字符

正则表达式中使用反斜杠 `\` 来转义下一个字符。这将允许你使用保留字符来作为匹配字符 `{ } [ ] / \ + * . $ ^ | ?`。在特殊字符前面加 `\`，就可以使用它来做匹配字符。
例如正则表达式 `.` 是用来匹配除了换行符以外的任意字符。现在要在输入字符串中匹配 `.` 字符，正则表达式 `(f|c|m)at\.?`，表示：小写字母 `f`、`c` 或者 `m` 后跟小写字母 `a`，后跟小写字母 `t`，后跟可选的 `.` 字符。

<pre style="color: gray;">
"(f|c|m)at\.?" => The <a href="#learn-regex"><strong>fat</strong></a> <a href="#learn-regex"><strong>cat</strong></a> sat on the <a href="#learn-regex"><strong>mat.</strong></a>
</pre>

## 2.8 定位符

在正则表达式中，为了检查匹配符号是否是起始符号或结尾符号，我们使用定位符。
定位符有两种类型：第一种类型是 `^` 检查匹配字符是否是起始字符，第二种类型是 `$`，它检查匹配字符是否是输入字符串的最后一个字符。

### 2.8.1 插入符号

插入符号 `^` 符号用于检查匹配字符是否是输入字符串的第一个字符。如果我们使用正则表达式 `^a`（如果 a 是起始符号）匹配字符串 `abc`，它会匹配到 `a`。
但是如果我们使用正则表达式 `^b`，它是匹配不到任何东西的，因为在字符串 `abc` 中“b”不是起始字符。
让我们来看看另一个正则表达式 `^(T|t)he`，这表示：大写字母 `T` 或小写字母 `t` 是输入字符串的起始符号，后面跟着小写字母 `h`，后跟小写字母 `e`。

<pre style="color: gray;">
"(T|t)he" => <a href="#learn-regex"><strong>The</strong></a> car is parked in <a href="#learn-regex"><strong>the</strong></a> garage.
</pre>

<pre style="color: gray;">
"^(T|t)he" => <a href="#learn-regex"><strong>The</strong></a> car is parked in the garage.
</pre>

### 2.8.2 美元符号

美元 `$` 符号用于检查匹配字符是否是输入字符串的最后一个字符。例如正则表达式 `(at\.)$`，表示：小写字母 `a`，后跟小写字母 `t`，后跟一个 `.` 字符，且这个匹配器必须是字符串的结尾。

<pre style="color: gray;">
"(at\.)" => The fat c<a href="#learn-regex"><strong>at.</strong></a> s<a href="#learn-regex"><strong>at.</strong></a> on the m<a href="#learn-regex"><strong>at.</strong></a>
</pre>

<pre style="color: gray;">
"(at\.)$" => The fat cat sat on the m<a href="#learn-regex"><strong>at.</strong></a>
</pre>

## 3. 简写字符集

正则表达式为常用的字符集和常用的正则表达式提供了简写。简写字符集如下：

| 简写 | 描述                                     |
| :--: | ---------------------------------------- |
|  .   | 匹配除换行符以外的任意字符               |
|  \w  | 匹配所有字母和数字的字符：`[a-zA-Z0-9_]` |
|  \W  | 匹配非字母和数字的字符：`[^\w]`          |
|  \d  | 匹配数字：`[0-9]`                        |
|  \D  | 匹配非数字：`[^\d]`                      |
|  \s  | 匹配空格符：`[\t\n\f\r\p{Z}]`            |
|  \S  | 匹配非空格符：`[^\s]`                    |

## 4. 断言

后行断言和先行断言有时候被称为断言，它们是特殊类型的 **_非捕获组_**（用于匹配模式，但不包括在匹配列表中）。当我们在一种特定模式之前或者之后有这种模式时，会优先使用断言。
例如我们想获取输入字符串 `$4.44 and $10.88` 中带有前缀 `$` 的所有数字。我们可以使用这个正则表达式 `(?<=\$)[0-9\.]*`，表示：获取包含 `.` 字符且前缀为 `$` 的所有数字。
以下是正则表达式中使用的断言：

| 符号 | 描述         |
| :--: | ------------ |
|  ?=  | 正向先行断言 |
|  ?!  | 负向先行断言 |
| ?<=  | 正向后行断言 |
| ?<!  | 负向后行断言 |

### 4.1 正向先行断言

正向先行断言认为第一部分的表达式的后面必须是先行断言表达式。返回的匹配结果仅包含与第一部分表达式匹配的文本。
要在一个括号内定义一个正向先行断言，在括号中问号和等号是这样使用的 `(?=...)`。先行断言表达式写在括号中的等号后面。
例如正则表达式 `(T|t)he(?=\sfat)`，表示：匹配大写字母 `T` 或小写字母 `t`，后面跟字母 `h`，后跟字母 `e`。
在括号中，我们定义了正向先行断言，它会引导正则表达式引擎匹配后面跟着 `fat` 的 `The` 或 `the`。

<pre style="color: gray;">
"(T|t)he(?=\sfat)" => <a href="#learn-regex"><strong>The</strong></a> fat cat sat on the mat.
</pre>

### 4.2 负向先行断言

当我们需要指定第一部分表达式的后面不跟随某一内容时，使用负向先行断言。负向先行断言的定义跟我们定义的正向先行断言一样，
唯一的区别在于我们使用否定符号 `!` 而不是等号 `=`，例如 `(?!...)`。
我们来看看下面的正则表达式 `(T|t)he(?!\sfat)`，表示：从输入字符串中获取全部 `The` 或者 `the` 且不匹配 `fat` 前面加上一个空格字符。

<pre style="color: gray;">
"(T|t)he(?!\sfat)" => The fat cat sat on <a href="#learn-regex"><strong>the</strong></a> mat.
</pre>

### 4.3 正向后行断言

正向后行断言用于获取跟随在特定模式之后的所有匹配内容。正向后行断言表示为 `(?<=...)`。例如正则表达式 `(?<=(T|t)he\s)(fat|mat)`，表示：从输入字符串中获取在单词 `The` 或 `the` 之后的所有 `fat` 和 `mat` 单词。

<pre style="color: gray;">
"(?<=(T|t)he\s)(fat|mat)" => The <a href="#learn-regex"><strong>fat</strong></a> cat sat on the <a href="#learn-regex"><strong>mat</strong></a>.
</pre>

### 4.4 负向后行断言

负向后行断言是用于获取不跟随在特定模式之后的所有匹配的内容。负向后行断言表示为 `(?<!...)`。例如正则表达式 `(?<!(T|t)he\s)(cat)`，表示：在输入字符中获取所有不在 `The` 或 `the` 之后的所有单词 `cat`。

<pre style="color: gray;">
"(?&lt;!(T|t)he\s)(cat)" => The cat sat on <a href="#learn-regex"><strong>cat</strong></a>.
</pre>

## 5. 标记

标记也称为修饰符，因为它会修改正则表达式的输出。这些标志可以以任意顺序或组合使用，并且是正则表达式的一部分。

| 标记 | 描述                                       |
| :--: | ------------------------------------------ |
|  i   | 不区分大小写：将匹配设置为不区分大小写。   |
|  g   | 全局搜索：搜索整个输入字符串中的所有匹配。 |
|  m   | 多行匹配：会匹配输入字符串每一行。         |

### 5.1 不区分大小写

`i` 修饰符用于执行不区分大小写匹配。例如正则表达式 `/The/gi`，表示：大写字母 `T`，后跟小写字母 `h`，后跟字母 `e`。
但是在正则匹配结束时 `i` 标记会告诉正则表达式引擎忽略这种情况。正如你所看到的，我们还使用了 `g` 标记，因为我们要在整个输入字符串中搜索匹配。

<pre style="color: gray;">
"The" => <a href="#learn-regex"><strong>The</strong></a> fat cat sat on the mat.
</pre>

<pre style="color: gray;">
"/The/gi" => <a href="#learn-regex"><strong>The</strong></a> fat cat sat on <a href="#learn-regex"><strong>the</strong></a> mat.
</pre>

### 5.2 全局搜索

`g` 修饰符用于执行全局匹配（会查找所有匹配，不会在查找到第一个匹配时就停止）。
例如正则表达式 `/.(at)/g`，表示：除换行符之外的任意字符，后跟小写字母 `a`，后跟小写字母 `t`。
因为我们在正则表达式的末尾使用了 `g` 标记，它会从整个输入字符串中找到每个匹配项。

<pre style="color: gray;">
".(at)" => The <a href="#learn-regex"><strong>fat</strong></a> cat sat on the mat.
</pre>

<pre style="color: gray;">
"/.(at)/g" => The <a href="#learn-regex"><strong>fat</strong></a> <a href="#learn-regex"><strong>cat</strong></a> <a href="#learn-regex"><strong>sat</strong></a> on the <a href="#learn-regex"><strong>mat</strong></a>.
</pre>

### 5.3 多行匹配

`m` 修饰符被用来执行多行的匹配。正如我们前面讨论过的 `(^, $)`，使用定位符来检查匹配字符是输入字符串开始或者结束。但是我们希望每一行都使用定位符，所以我们就使用 `m` 修饰符。
例如正则表达式 `/at(.)?$/gm`，表示：小写字母 `a`，后跟小写字母 `t`，匹配除了换行符以外任意字符零次或一次。而且因为 `m` 标记，现在正则表达式引擎匹配字符串中每一行的末尾。

<pre style="color: gray;">
"/.at(.)?$/" => The fat
                cat sat
                on the <a href="#learn-regex"><strong>mat.</strong></a>
</pre>

<pre style="color: gray;">
"/.at(.)?$/gm" => The <a href="#learn-regex"><strong>fat</strong></a>
                  cat <a href="#learn-regex"><strong>sat</strong></a>
                  on the <a href="#learn-regex"><strong>mat.</strong></a>
</pre>

## 常用正则表达式

- **正整数**：`^\d+$`
- **负整数**：`^-\d+$`
- **电话号码**：`^+?[\d\s]{3,}$`
- **电话代码**：`^+?[\d\s]+(?[\d\s]{10,}$`
- **整数**：`^-?\d+$`
- **用户名**：`^[\w\d_.]{4,16}$`
- **字母数字字符**：`^[a-zA-Z0-9]*$`
- **带空格的字母数字字符**：`^[a-zA-Z0-9 ]*$`
- **密码**：`^(?=^.{6,}$)((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.*$`
- **电子邮件**：`^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$`
- **IPv4 地址**：`^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$`
- **小写字母**：`^([a-z])*$`
- **大写字母**：`^([A-Z])*$`
- **网址**：`^(((http|https|ftp):\/\/)?([[a-zA-Z0-9]\-\.])+(\.)([[a-zA-Z0-9]]){2,4}([[a-zA-Z0-9]\/+=%&_\.~?\-]*))*$`
- **VISA 信用卡号码**：`^(4[0-9]{12}(?:[0-9]{3})?)*$`
- **日期（MM/DD/YYYY）**：`^(0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2}$`
- **日期（YYYY/MM/DD）**：`^(19|20)?[0-9]{2}[- /.](0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])$`
- **万事达信用卡号码**：`^(5[1-5][0-9]{14})*$`
