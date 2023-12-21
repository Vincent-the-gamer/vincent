---
title: 项目 - Vincent-the-gamer
display: 项目
description: 我在GitHub上发布的一些好玩的项目
plum: true
wrapperClass: 'text-center'
projects:
  目前正在进行:
    - name: 'CardForge'
      link: 'https://github.com/Vincent-the-gamer/cardforge'
      desc: 'A HearthStone card maker. 炉石传说卡牌制作器。'
      icon: 'cardforge'

  之前的项目:
    - name: 'Nemassler'
      link: 'https://github.com/Vincent-the-gamer/Nemassler'
      desc: 'Transform Netease Music .ncm audio into .mp3 audio, and support .mp3 BPM calculation。
      <br/>支持WYY音乐.ncm转.mp3，以及音频BPM（每分钟节拍数）计算。'
      icon: 'nemassler'
    
    - name: 'Wenyan-lang Backend Server'
      link: 'https://github.com/Vincent-the-gamer/Wenyan-Backend-Server'
      desc: 'A server to compile wenyan-lang. 文言文编程语言的API接口服务。'
      icon: 'wenyan'

    - name: '没写完，剩下的有空再说'
      link: 'https://github.com/Vincent-the-gamer/Wenyan-Backend-Server'
      desc: '图标用来占个位'
      icon: 'cardforge'

---

<!-- @layout-full-width -->

<ListProjects :projects="frontmatter.projects" />
