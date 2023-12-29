---
title: 项目 - Vincent
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
  
  好玩的项目:
    - name: 'Kaomoe (*￣▽￣)b'
      link: 'https://github.com/Vincent-the-gamer/kaomoe'
      desc: 'A generator of cute Kaomojis. 颜文字生成器'
      icon: 'kaomoe'
    - name: 'Wenyan API'
      link: 'https://github.com/Vincent-the-gamer/wenyan-api'
      desc: 'Wenyan-lang HTTP API.  文言文编程语言HTTP API。'
      icon: 'wenyan'
    - name: "This Repo Has N Stars"
      link: 'https://github.com/search?q=Vincent-the-gamer%2Fthis-repo-has&type=repositories'
      desc: '这个仓库有N颗星星！Star的数量发生改变时，项目名称会动态更新！'
      icon: 'n-stars'

  工具项目:
    - name: 'Nemassler'
      link: 'https://github.com/Vincent-the-gamer/Nemassler'
      desc: 'Transform Netease Music .ncm audio into .mp3 audio, and support .mp3 BPM calculation。
      <br/>支持WYY音乐.ncm转.mp3，以及音频BPM（每分钟节拍数）计算。'
      icon: 'nemassler'

    - name: 'G-Shock Date Checker'
      link: 'https://github.com/Vincent-the-gamer/g-shock-date-checker'
      desc: 'Check your Casio G-SHOCK production factory & production date. <br/>查询你的卡西欧G-Shock手表的产地和生产日期。'
      icon: 'g-shock'

  实用的模板:
    - name: 'Yew.rs Template'
      link: 'https://github.com/Vincent-the-gamer/yew-template'
      desc: 'Yew.rs项目基础模板。Yew.rs是一个Rust WebAssembly前端框架'
      icon: 'yew'

---

<!-- @layout-full-width -->

<ListProjects :projects="frontmatter.projects" />
