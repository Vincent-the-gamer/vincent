---
title: 视频专区 - Vincent
display: ''
plum: true
gameVideos:
  - title: "视频 -【攻略向】诡锋《零：濡鸦之巫女》全收集，全难度SS评价，全剧情攻略向流程大合集"
    date: '2021-11-09'
    path: 'https://www.bilibili.com/video/BV1734y1Z7GE'
    platform: Bilibili
    lang: 'zh'
launchpadVideos:
  - title: "等之后发了再说"
    date: '2023-12-22'
    path: 'https://space.bilibili.com/3342738'
    platform: Bilibili
    lang: 'zh'
---

<SubNav />

<h1>游戏视频</h1>
<ListPosts :posts="frontmatter.gameVideos.reverse()" />

<hr/>

<h1>Launchpad视频</h1>
<ListPosts :posts="frontmatter.launchpadVideos.reverse()" />
