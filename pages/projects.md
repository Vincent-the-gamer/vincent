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
    - name: 'Nemahaizai'
      link: 'https://github.com/Vincent-the-gamer/cardforge'
      desc: '使用Tauri + Rust重写的Nemassler(WYY音乐.ncm转.mp3，以及音频BPM[每分钟节拍数] 计算), 后续会合并到Nemassler.'
      icon: 'nemahaizai'
  
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
      link: 'https://github.com/Vincent-the-gamer/this-repo-has-4-stars'
      desc: '这个仓库有N颗星星！Star的数量发生改变时，项目名称会动态更新！'
      icon: 'n-stars'

  工具项目:
    - name: 'Nemassler'
      link: 'https://github.com/Vincent-the-gamer/Nemassler'
      desc: 'Transform Netease Music .ncm audio into .mp3 audio, and support .mp3 BPM calculation。
      <br/>WYY音乐.ncm转.mp3，以及音频BPM（每分钟节拍数）计算。'
      icon: 'nemassler'
    - name: 'G-Shock Date Checker'
      link: 'https://github.com/Vincent-the-gamer/g-shock-date-checker'
      desc: 'Check your Casio G-SHOCK production factory & production date. <br/>查询你的卡西欧G-Shock手表的产地和生产日期。'
      icon: 'g-shock'
    - name: '@vincent-the-gamer/utils'
      link: 'https://github.com/Vincent-the-gamer/utils'
      desc: '自己编写的JavaScript/TypeScript实用工具'
      icon: 'utils'

  实用的模板:
    - name: 'Yew.rs Template'
      link: 'https://github.com/Vincent-the-gamer/yew-template'
      desc: 'Yew.rs项目基础模板。Yew.rs是一个Rust WebAssembly前端框架'
      icon: 'yew'
    - name: "VitePress Starter(VitePress起手模板)"
      link: "https://github.com/Vincent-the-gamer/vitepress-starter"
      desc: 'Opinionated VitePress Template. <br/>固执己见的VitePress文档网页起手模板。'
      icon: 'vitepress'
    - name: "Vitesse Superslim"
      link: "https://github.com/Vincent-the-gamer/vitesse-superslim"
      desc: '极简版Vue + Vite起手模板'
      icon: 'vitesse'

  VS Code主题:
    - name: 'NeonHeart'
      link: 'https://github.com/Vincent-the-gamer/neonheart'
      desc: 'An opinionated VS Code theme. 固执己见的VSCode主题。'
      icon: 'neonheart'

  实用工具推荐:
    - name: 'Picdiet'
      link: 'https://vincent-the-gamer.github.io/Picdiet/'
      desc: 'Picdiet是一款在线批量压缩图片神器，它不需要后端服务器或者API的支持，仅通过你的浏览器来压缩图片大小。'
      icon: 'picdiet'

    - name: 'GitHub Socialify'
      link: 'https://socialify.git.ci/'
      desc: '生成GitHub Repo项目banner图片, 可以展示stars, issues, pull requests等信息'
      icon: 'github'

    - name: 'Transfonter'
      link: 'https://transfonter.org/'
      desc: '字体转换器，可以在TTF, WOFF, WOFF2, SVG字体间互转, 可以导入OTF转成其它格式。'
      icon: 'transfonter'


---

<!-- @layout-full-width -->

<ListProjects :projects="frontmatter.projects" />
