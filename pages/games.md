---
title: 游戏历程 - Vincent
display: ''
plum: true
games:
    - name: "PS5《宇宙机器人无线控制器使用指南》白金奖杯"
      date: "2021-05-24"
      image: /images/games/astro-playroom.png
      id: 1
    - name: "PS5《战神：诸神黄昏》白金奖杯"
      date: "2022-11-24"
      image: /images/games/gow-ragnarok.png
      id: 2
    - name: "PS5《漫威蜘蛛侠2》白金奖杯"
      date: "2023-10-30"
      image: /images/games/spiderman-2.png
      id: 3
    - name: "PS5《生化危机4：重制版》白金奖杯"
      date: "2023-11-6"
      image: /images/games/re4-remake.jpg
      id: 4
---

<SubNav />

<ListGames :games="frontmatter.games.reverse()"/>