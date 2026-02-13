---
title: SheetJS的xlsx库解析日期类型丢失43秒的问题
date: 2026-02-13
lang: zh
art: dots
---

> [!IMPORTANT] 重要
> 参考文献：https://juejin.cn/post/7384276135439646747

## 前言

如果你在用Node.js开发后端，请使用`node-xlsx`包来解析Excel文件。
如果你是在前端解析Excel，并且也用SheetJS的XLSX工具，那么请注意您的时间解析。

## 时间解析的坑

在使用 SheetJS.xlsx 库调用 `xlsx.read(data, { cellDates: true })` 解析 Excel 文件时会把单元格为日期类型的数据直接转化为 Date 对象。但是在实际使用时，解析的 Date 总是有 43 秒的误差。例如在 Excel 中日期类型的单元格值为 2023/8/15，但是解析的结果则为 `Mon Aug 14 2023 23:59:17 GMT+0800 (中国标准时间)` 的 Date 对象；同样其他日期也是与实际解析结果有 43 秒误差。

## 根本原因

1. 在 Excel 中，日期是被存储为自 1899 年 12 月 30 日以来的天数，以整数形式存储。
2. 中国时区在 1899 年的时差偏移量是 +8:05:43。
3. SheetJS 使用了 `getTimezoneOffset` 来解决误差，但是 `getTimezoneOffset` 以整数形式返回分钟部分，忽略了秒的部分，所以造成了 43 秒的误差。

## 解决办法

~~失败的办法：尝试使用dayjs加上43秒，但是整点会差一秒~~

### 第一种

简单粗暴，我用的就是这种，也就是把**Excel的时间字段格式设置成文本，然后直接读取文本**

### 第二种

可以先用`sheet_to_csv`方法将Excel文件转换为CSV文件，然后再使用`parseCsvToJson`这个函数把csv转json，最后把正确时间拼接到`sheet_to_json`的结果。

```ts
// 工作表名称集合
var sheetNames = workbook.SheetNames;
// 只读取第一张sheet
var worksheet = workbook.Sheets[sheetNames[0]];
//获取json格式的数据
var parseJson = XLSX.utils.sheet_to_json(worksheet);
var csvstr = XLSX.utils.sheet_to_csv(worksheet);

const parseCsvToJson = (csvStr) => {
  // 分割文本为行
  const lines = csvStr.trim().split("\n");
  //第一行是标题行（字段名）
  const headers = lines.shift().split(",");
  const parsedData = lines.map((line) => {
    // 分割每行的数据
    const values = line.trim().split(",");
    // 创建一个对象来存储当前行的数据
    const rowData = {};
    // 遍历字段名和字段值，并将它们对应起来
    values.forEach((value, index) => {
      // 使用字段名作为属性名，并去除空格
      const key = headers[index].trim();
      // 存储值（在这里我们假设所有值都是字符串）
      rowData[key] = value.trim();
    });
    // 返回当前行的数据对象
    return rowData;
  });
  return parsedData;
};
```
