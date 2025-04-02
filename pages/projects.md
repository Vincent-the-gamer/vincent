---
title: 项目/工具 - Vincent
display: 项目/工具
description: 我在GitHub上发布的一些好玩的项目
art: dots
wrapperClass: 'text-center'
projects:
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
    - name: 'modern-html2pdf'
      link: 'https://github.com/Vincent-the-gamer/modern-html2pdf'
      desc: '把HTML单/多节点转换为多页PDF'
      icon: 'html2pdf'

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
    - name: "slidev-resume"
      link: "https://github.com/Vincent-the-gamer/slidev-resume"
      desc: "Slidev简历模板，支持Web端部署和pdf/pptx导出"
      icon: "slidev"
    - name: "nitro-starter"
      link: "https://github.com/Vincent-the-gamer/nitro-starter"
      desc: "基于Node.js，使用Nitro框架进行快速后端项目构建的模板"
      icon: "nitro"

  VS Code主题:
    - name: 'VSCode Theme Aya'
      link: 'https://github.com/Vincent-the-gamer/vscode-theme-aya'
      desc: 'Murasame-style VSCode theme. 丛雨VSCode主题。'
      icon: 'aya'

    - name: 'VSCode Theme NeonHeart'
      link: 'https://github.com/Vincent-the-gamer/neonheart'
      desc: 'An opinionated VS Code theme. 个人风格向的VSCode主题。'
      icon: 'neonheart'

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
    - name: 'CardForge'
      link: 'https://github.com/Vincent-the-gamer/cardforge'
      desc: 'A HearthStone card maker. 炉石传说卡牌制作器。'
      icon: 'cardforge'

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

    - name: "在线音频处理"
      link: "https://vocalremover.org/zh/cutter"
      desc: "可以在线对音频进行各种处理"
      icon: "music"

    - name: "在线音频可视化"
      link: "https://vizzy.io/"
      desc: "在线免费生成音频可视化的视频"
      icon: "vizzy"

    - name: "特殊符号集"
      link: "https://cn.piliapp.com/symbol/"
      desc: "快速寻找特殊符号"
      icon: "special-symbol"
  
  动漫下载站:
    - name: "MioBT"
      link: "https://miobt.com/"
      desc: "＊MioBT＊★就是＊MioBT＊喵～"
      icon: "mio-bt"

    - name: "蜜柑计划"
      link: "https://mikanani.me/"
      desc: "蜜柑计划：新一代的动漫下载站"
      icon: "mikan"
    
    - name: "Nyaa.si"
      link: "https://nyaa.si/"
      desc: "A BitTorrent community focused on Eastern Asian media including anime, manga, music, and more"
      icon: "nyaa"

---

<!-- @layout-full-width -->

<ListProjects :projects="frontmatter.projects" />
